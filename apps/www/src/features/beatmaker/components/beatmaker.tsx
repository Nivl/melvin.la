"use client";
import { Button, Card, Separator, toast } from "@heroui/react";
import { captureException } from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { BeatmakerState, Engine, Kit, StepCount, TrackId } from "#features/beatmaker/models";
import {
  buildDefaultState,
  buildTrackRecord,
  createEngine,
  decode,
  encode,
  PRESETS,
  TRACK_IDS,
} from "#features/beatmaker/models";
import { Section } from "#shared/components/layout/section";
import { getWindow } from "#shared/utils/window";

import { KitSelector } from "./kit-selector";
import { LandscapeGuard } from "./landscape-guard";
import { MixerStrip } from "./mixer-strip";
import { PatternPresets } from "./pattern-presets";
import { SequencerGrid } from "./sequencer-grid";
import { Transport } from "./transport";

const readHashData = (): {
  state: BeatmakerState;
  hasCustomSamples: boolean;
} => {
  const win = getWindow();

  if (win === undefined) {
    return {
      hasCustomSamples: false,
      state: buildDefaultState(),
    };
  }

  const hash = globalThis.location.hash.replace("#", "");
  const decoded = decode(hash);
  if (!decoded) {
    return {
      hasCustomSamples: false,
      state: buildDefaultState(),
    };
  }

  const { hasCustomSamples, ...rest } = decoded;
  return {
    hasCustomSamples,
    state: { ...rest, isPlaying: false },
  };
};

let cachedBeatmakerHash: string | undefined = undefined;
let cachedBeatmakerIOS: boolean | undefined = undefined;
let cachedBeatmakerView:
  | {
      state: BeatmakerState;
      hasCustomSamples: boolean;
      showIOSWarning: boolean;
    }
  | undefined = undefined;
const beatmakerServerSnapshot = {
  hasCustomSamples: false,
  showIOSWarning: false,
  state: buildDefaultState(),
};

const isIOSDevice = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1)
  );
};

const getInitialBeatmakerView = (): {
  state: BeatmakerState;
  hasCustomSamples: boolean;
  showIOSWarning: boolean;
} => {
  const win = getWindow();
  const currentHash = win === undefined ? "" : globalThis.location.hash;
  const showIOSWarning = isIOSDevice();

  if (
    cachedBeatmakerView &&
    cachedBeatmakerHash === currentHash &&
    cachedBeatmakerIOS === showIOSWarning
  ) {
    return cachedBeatmakerView;
  }

  const initialData = readHashData();

  cachedBeatmakerHash = currentHash;
  cachedBeatmakerIOS = showIOSWarning;
  cachedBeatmakerView = {
    hasCustomSamples: initialData.hasCustomSamples,
    showIOSWarning,
    state: initialData.state,
  };

  return cachedBeatmakerView;
};

const noopUnsubscribe = () => undefined;

const subscribeBeatmakerView = (onStoreChange: () => void): (() => void) => {
  const win = getWindow();
  if (win === undefined) {
    return noopUnsubscribe;
  }

  win.addEventListener("hashchange", onStoreChange);

  return () => {
    win.removeEventListener("hashchange", onStoreChange);
  };
};

const getBeatmakerServerSnapshot = (): ReturnType<typeof getInitialBeatmakerView> =>
  beatmakerServerSnapshot;

export const Beatmaker = () => {
  const win = getWindow();
  const t = useTranslations("beatmaker");
  const tKits = useTranslations("beatmaker.kits");
  const initialView = useSyncExternalStore(
    subscribeBeatmakerView,
    getInitialBeatmakerView,
    getBeatmakerServerSnapshot,
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const hasInteractedRef = useRef(false);
  const [localState, setLocalState] = useState<BeatmakerState>(buildDefaultState);
  const [dismissedIOSWarning, setDismissedIOSWarning] = useState(false);
  const state = hasInteracted ? localState : initialView.state;
  const showIOSWarning = !dismissedIOSWarning && initialView.showIOSWarning;

  const [decodeErrors, setDecodeErrors] = useState<Partial<Record<TrackId, string>>>({});
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [activeStep, setActiveStep] = useState<number | undefined>();
  const [audioState, setAudioState] = useState<AudioContextState | undefined>();
  const engineRef = useRef<Engine | null>(null);
  const stateRef = useRef(state);
  const customBannerShownRef = useRef(false);
  const skipInitialHashSyncRef = useRef(win !== undefined && globalThis.location.hash === "");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const updateState = useCallback(
    (updater: BeatmakerState | ((current: BeatmakerState) => BeatmakerState)) => {
      const interacted = hasInteractedRef.current;
      const baseState = stateRef.current;

      hasInteractedRef.current = true;
      setHasInteracted(true);
      setLocalState((current) => {
        const previousState = interacted ? current : baseState;

        return typeof updater === "function" ? updater(previousState) : updater;
      });
    },
    [],
  );

  useEffect(() => {
    const engine = createEngine({
      onError: (error) => {
        captureException(error);
        toast.danger(t("error.audioEngine"));
      },
      onStateChange: setAudioState,
      onStep: setActiveStep,
    });
    engineRef.current = engine;

    const unlock = () => {
      engine.init().then(() => {
        document.removeEventListener("touchstart", unlock);
        document.removeEventListener("click", unlock);
        document.removeEventListener("keydown", unlock);
      }, captureException);
    };

    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("click", unlock, { passive: true });
    document.addEventListener("keydown", unlock, { passive: true });

    return () => {
      engine.dispose().catch(captureException);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [t]);

  // Monitor audio context state
  useEffect(() => {
    if (state.isPlaying && audioState === "suspended") {
      toast.warning(t("error.audioSuspended"), {
        actionProps: {
          children: t("actions.resume"),
          onPress: () => {
            const engine = engineRef.current;
            if (engine) {
              engine.init().catch(captureException);
            }
          },
          variant: "tertiary",
        },
        timeout: 0,
      });
    }
  }, [state.isPlaying, audioState, t]);

  // Load kit samples on mount and when kit changes
  useEffect(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.loadKit(state.kit).catch(captureException);
    }
  }, [state.kit]);

  // Sync URL hash on state change (debounced)
  useEffect(() => {
    if (skipInitialHashSyncRef.current) {
      skipInitialHashSyncRef.current = false;
      return undefined;
    }

    const hasCustom = TRACK_IDS.some((id) => Boolean(state.tracks[id].customFile));
    const timer = setTimeout(() => {
      globalThis.history.replaceState(undefined, "", `#${encode(state, hasCustom)}`);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  // Show a warning toast on mount if the shared pattern used custom samples
  useEffect(() => {
    if (!initialView.hasCustomSamples || customBannerShownRef.current) {
      return;
    }

    customBannerShownRef.current = true;
    toast.warning(t("share.customSampleNotice", { kit: tKits(state.kit) }), {
      timeout: 0,
    });
  }, [initialView.hasCustomSamples, state.kit, t, tKits]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handlePlayToggle = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    if (state.isPlaying) {
      engine.stop();
      setActiveStep(undefined);
      updateState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      await engine.init();
      await engine.start(() => stateRef.current);
      updateState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [state.isPlaying, updateState]);

  const handleBpmChange = useCallback(
    (bpm: number) => {
      updateState((prev) => ({ ...prev, bpm }));
    },
    [updateState],
  );

  const handleStepCountChange = useCallback(
    (stepCount: StepCount) => {
      updateState((prev) => {
        const tracks = buildTrackRecord((id) => {
          const current = prev.tracks[id].steps;
          const steps: boolean[] =
            stepCount > current.length
              ? [
                  ...current,
                  ...Array.from<boolean>({
                    length: stepCount - current.length,
                  }).fill(false),
                ]
              : current.slice(0, stepCount);
          return { ...prev.tracks[id], steps };
        });
        return { ...prev, stepCount, tracks };
      });
    },
    [updateState],
  );

  const handleKitChange = useCallback(
    (kit: Kit) => {
      engineRef.current?.clearCustomFiles();
      setDecodeErrors({});
      updateState((prev) => ({
        ...prev,
        kit,
        tracks: buildTrackRecord((id) => ({ ...prev.tracks[id], customFile: undefined })),
      }));
    },
    [updateState],
  );

  const handlePresetSelect = useCallback(
    async (presetId: string) => {
      const preset = PRESETS[presetId];
      const engine = engineRef.current;
      const wasPlaying = stateRef.current.isPlaying;
      // Compute the next state and update stateRef synchronously so the engine
      // scheduler reads the new pattern on its very first tick, before React
      // commits the setState update via the useEffect.
      const nextState = {
        ...stateRef.current,
        ...preset,
        isPlaying: stateRef.current.isPlaying,
      };
      setDecodeErrors({});
      stateRef.current = nextState;
      updateState(nextState);
      engine?.clearCustomFiles();
      if (wasPlaying && engine) {
        // Reset engine step counter so the new pattern starts from step 0
        engine.stop();
        setActiveStep(undefined);
        await engine.start(() => stateRef.current);
      }
    },
    [updateState],
  );

  const handleStepToggle = useCallback(
    (trackId: TrackId, index: number) => {
      updateState((prev) => {
        const steps = prev.tracks[trackId].steps.map((step, idx) => (idx === index ? !step : step));
        return {
          ...prev,
          tracks: { ...prev.tracks, [trackId]: { ...prev.tracks[trackId], steps } },
        };
      });
    },
    [updateState],
  );

  const handleFileLoad = useCallback(
    async (trackId: TrackId, file: File) => {
      const engine = engineRef.current;
      if (!engine) {
        return;
      }
      try {
        await engine.init();
        await engine.loadCustomFile(trackId, file);
        updateState((prev) => ({
          ...prev,
          tracks: {
            ...prev.tracks,
            [trackId]: { ...prev.tracks[trackId], customFile: file },
          },
        }));
        setDecodeErrors((errors) => ({ ...errors, [trackId]: undefined }));
      } catch (error) {
        captureException(error);
        setDecodeErrors((errors) => ({
          ...errors,
          [trackId]: t("track.decodeError"),
        }));
      }
    },
    [t, updateState],
  );

  const handleVolumeChange = useCallback(
    (trackId: TrackId, volume: number) => {
      updateState((prev) => ({
        ...prev,
        tracks: { ...prev.tracks, [trackId]: { ...prev.tracks[trackId], volume } },
      }));
    },
    [updateState],
  );

  const handlePanChange = useCallback(
    (trackId: TrackId, pan: number) => {
      updateState((prev) => ({
        ...prev,
        tracks: { ...prev.tracks, [trackId]: { ...prev.tracks[trackId], pan } },
      }));
    },
    [updateState],
  );

  const handleMuteToggle = useCallback(
    (trackId: TrackId) => {
      updateState((prev) => ({
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: { ...prev.tracks[trackId], muted: !prev.tracks[trackId].muted },
        },
      }));
    },
    [updateState],
  );

  const handleCopy = useCallback(async () => {
    const clipboard = (
      globalThis as {
        navigator?: {
          clipboard?: { writeText?: (string: string) => Promise<void> };
        };
      }
    ).navigator?.clipboard;

    if (typeof clipboard?.writeText !== "function") {
      return;
    }

    try {
      const currentState = stateRef.current;
      const hasCustom = TRACK_IDS.some((id) => Boolean(currentState.tracks[id].customFile));
      const hash = encode(currentState, hasCustom);
      const url = `${globalThis.location.origin}${globalThis.location.pathname}#${hash}`;

      await clipboard.writeText(url);
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable (insecure context or permission denied); ignore silently
    }
  }, []);

  useEffect(
    () => () => {
      clearTimeout(copyTimerRef.current);
    },
    [],
  );

  return (
    <LandscapeGuard>
      <Section className="max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("metadata.title")}
        </h1>
      </Section>

      <Section>
        <div className="m-auto max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
          <div className="flex flex-col items-center gap-8">
            {showIOSWarning && (
              <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-warning bg-warning px-4 py-3 text-sm text-warning-foreground dark:border-warning dark:bg-warning/30 dark:text-warning">
                <div>
                  <p className="font-semibold">{t("iosWarning.title")}</p>
                  <p>{t("iosWarning.message")}</p>
                </div>
                <Button
                  size="sm"
                  variant="tertiary"
                  onPress={() => {
                    setDismissedIOSWarning(true);
                  }}
                >
                  {t("share.dismissNotice")}
                </Button>
              </div>
            )}

            {/* Card 1: Transport + Share */}
            <Card className="w-full">
              <Card.Content>
                <Transport
                  isPlaying={state.isPlaying}
                  bpm={state.bpm}
                  stepCount={state.stepCount}
                  copied={copied}
                  onPlayToggle={() => {
                    handlePlayToggle().catch(captureException);
                  }}
                  onBpmChange={handleBpmChange}
                  onStepCountChange={handleStepCountChange}
                  onCopy={() => {
                    handleCopy().catch(captureException);
                  }}
                />
              </Card.Content>
            </Card>

            {/* Card 2: Options (Kit + Presets) */}
            <Card className="w-full">
              <Card.Content className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <KitSelector activeKit={state.kit} onKitChange={handleKitChange} />
                  <Separator className="my-auto h-5" orientation="vertical" variant="tertiary" />
                  <PatternPresets
                    onPresetSelect={(presetId) => {
                      handlePresetSelect(presetId).catch(captureException);
                    }}
                  />
                </div>
              </Card.Content>
            </Card>

            {/* Card 3: Sequencer */}
            <Card className="w-full">
              <Card.Content className="py-2">
                <SequencerGrid
                  tracks={state.tracks}
                  onStepToggle={handleStepToggle}
                  onFileLoad={(trackId, file) => {
                    handleFileLoad(trackId, file).catch(captureException);
                  }}
                  decodeErrors={decodeErrors}
                  activeStep={activeStep}
                />
              </Card.Content>
            </Card>

            {/* Card 4: Mixer */}
            <Card className="w-full">
              <Card.Content className="p-2">
                <p className="mb-3 text-xs tracking-widest uppercase">{t("mixer.title")}</p>
                <div className="grid grid-cols-6 gap-2.5">
                  {TRACK_IDS.map((trackId) => (
                    <div
                      key={trackId}
                      className="flex flex-col items-center rounded-xl border border-default p-3"
                    >
                      <MixerStrip
                        trackId={trackId}
                        volume={state.tracks[trackId].volume}
                        pan={state.tracks[trackId].pan}
                        muted={state.tracks[trackId].muted}
                        onVolumeChange={(v) => {
                          handleVolumeChange(trackId, v);
                        }}
                        onPanChange={(v) => {
                          handlePanChange(trackId, v);
                        }}
                        onMuteToggle={() => {
                          handleMuteToggle(trackId);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Section>
    </LandscapeGuard>
  );
};
