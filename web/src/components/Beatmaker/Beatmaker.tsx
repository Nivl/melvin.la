'use client';
import { Button, Card, Separator, toast } from '@heroui/react';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { Section } from '#components/layout/Section';
import {
  type BeatmakerState,
  buildDefaultState,
  createEngine,
  decode,
  encode,
  type Engine,
  type Kit,
  PRESETS,
  type StepCount,
  TRACK_IDS,
  type TrackId,
} from '#models/beatmaker';

import { KitSelector } from './KitSelector';
import { LandscapeGuard } from './LandscapeGuard';
import { MixerStrip } from './MixerStrip';
import { PatternPresets } from './PatternPresets';
import { SequencerGrid } from './SequencerGrid';
import { Transport } from './Transport';

function readHashData(): {
  state: BeatmakerState;
  hasCustomSamples: boolean;
} {
  if (globalThis.window === undefined) {
    return {
      state: buildDefaultState(),
      hasCustomSamples: false,
    };
  }

  const hash = globalThis.location.hash.replace('#', '');
  const decoded = decode(hash);
  if (!decoded) {
    return {
      state: buildDefaultState(),
      hasCustomSamples: false,
    };
  }

  const { hasCustomSamples, ...rest } = decoded;
  return {
    state: { ...rest, isPlaying: false },
    hasCustomSamples,
  };
}

let cachedBeatmakerHash: string | undefined;
let cachedBeatmakerIOS: boolean | undefined;
let cachedBeatmakerView:
  | {
      state: BeatmakerState;
      hasCustomSamples: boolean;
      showIOSWarning: boolean;
    }
  | undefined;
const beatmakerServerSnapshot = {
  state: buildDefaultState(),
  hasCustomSamples: false,
  showIOSWarning: false,
};

function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
  );
}

function getInitialBeatmakerView(): {
  state: BeatmakerState;
  hasCustomSamples: boolean;
  showIOSWarning: boolean;
} {
  const currentHash =
    globalThis.window === undefined ? '' : globalThis.location.hash;
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
    state: initialData.state,
    hasCustomSamples: initialData.hasCustomSamples,
    showIOSWarning,
  };

  return cachedBeatmakerView;
}

function subscribeBeatmakerView(onStoreChange: () => void): () => void {
  if (globalThis.window === undefined) {
    const noopUnsubscribe = () => 0;
    return noopUnsubscribe;
  }

  globalThis.window.addEventListener('hashchange', onStoreChange);

  return () => {
    globalThis.window.removeEventListener('hashchange', onStoreChange);
  };
}

function getBeatmakerServerSnapshot(): ReturnType<
  typeof getInitialBeatmakerView
> {
  return beatmakerServerSnapshot;
}

export function Beatmaker() {
  const t = useTranslations('beatmaker');
  const tKits = useTranslations('beatmaker.kits');
  const initialView = useSyncExternalStore(
    subscribeBeatmakerView,
    getInitialBeatmakerView,
    getBeatmakerServerSnapshot,
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const hasInteractedRef = useRef(false);
  const [localState, setLocalState] =
    useState<BeatmakerState>(buildDefaultState);
  const [dismissedIOSWarning, setDismissedIOSWarning] = useState(false);
  const state = hasInteracted ? localState : initialView.state;
  const showIOSWarning = !dismissedIOSWarning && initialView.showIOSWarning;

  const [decodeErrors, setDecodeErrors] = useState<
    Partial<Record<TrackId, string>>
  >({});
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [activeStep, setActiveStep] = useState<number | undefined>();
  const [audioState, setAudioState] = useState<AudioContextState | undefined>();
  const engineRef = useRef<Engine | null>(null);
  const stateRef = useRef(state);
  const customBannerShownRef = useRef(false);
  const skipInitialHashSyncRef = useRef(
    globalThis.window !== undefined && globalThis.location.hash === '',
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const updateState = useCallback(
    (
      updater: BeatmakerState | ((current: BeatmakerState) => BeatmakerState),
    ) => {
      const interacted = hasInteractedRef.current;
      const baseState = stateRef.current;

      hasInteractedRef.current = true;
      setHasInteracted(true);
      setLocalState(current => {
        const previousState = interacted ? current : baseState;

        return typeof updater === 'function' ? updater(previousState) : updater;
      });
    },
    [],
  );

  useEffect(() => {
    const engine = createEngine({
      onError: error => {
        captureException(error);
        toast.danger(t('error.audioEngine'));
      },
      onStep: setActiveStep,
      onStateChange: setAudioState,
    });
    engineRef.current = engine;

    const unlock = () => {
      void engine.init();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };

    document.addEventListener('touchstart', unlock, { passive: true });
    document.addEventListener('click', unlock, { passive: true });
    document.addEventListener('keydown', unlock, { passive: true });

    return () => {
      engine.dispose();
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, [t]);

  // Monitor audio context state
  useEffect(() => {
    if (state.isPlaying && audioState === 'suspended') {
      toast.warning(t('error.audioSuspended'), {
        timeout: 0,
        actionProps: {
          children: t('actions.resume'),
          onPress: () => {
            void engineRef.current?.init();
          },
          variant: 'tertiary',
        },
      });
    }
  }, [state.isPlaying, audioState, t]);

  // Load kit samples on mount and when kit changes
  useEffect(() => {
    void engineRef.current?.loadKit(state.kit);
  }, [state.kit]);

  // Sync URL hash on state change (debounced)
  useEffect(() => {
    if (skipInitialHashSyncRef.current) {
      skipInitialHashSyncRef.current = false;
      return;
    }

    const hasCustom = TRACK_IDS.some(id => !!state.tracks[id].customFile);
    const timer = setTimeout(() => {
      globalThis.history.replaceState(
        undefined,
        '',
        `#${encode(state, hasCustom)}`,
      );
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  // Show a warning toast on mount if the shared pattern used custom samples
  useEffect(() => {
    if (!initialView.hasCustomSamples || customBannerShownRef.current) return;

    customBannerShownRef.current = true;
    toast.warning(t('share.customSampleNotice', { kit: tKits(state.kit) }), {
      timeout: 0,
    });
  }, [initialView.hasCustomSamples, state.kit, t, tKits]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handlePlayToggle = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (state.isPlaying) {
      engine.stop();
      setActiveStep(undefined);
      updateState(s => ({ ...s, isPlaying: false }));
    } else {
      await engine.init();
      engine.start(() => stateRef.current);
      updateState(s => ({ ...s, isPlaying: true }));
    }
  }, [state.isPlaying, updateState]);

  const handleBpmChange = useCallback(
    (bpm: number) => {
      updateState(s => ({ ...s, bpm }));
    },
    [updateState],
  );

  const handleStepCountChange = useCallback(
    (stepCount: StepCount) => {
      updateState(s => {
        const tracks = Object.fromEntries(
          TRACK_IDS.map(id => {
            const current = s.tracks[id].steps;
            const steps: boolean[] =
              stepCount > current.length
                ? [
                    ...current,
                    ...Array.from<boolean>({
                      length: stepCount - current.length,
                    }).fill(false),
                  ]
                : current.slice(0, stepCount);
            return [id, { ...s.tracks[id], steps }];
          }),
        ) as BeatmakerState['tracks'];
        return { ...s, stepCount, tracks };
      });
    },
    [updateState],
  );

  const handleKitChange = useCallback(
    (kit: Kit) => {
      engineRef.current?.clearCustomFiles();
      setDecodeErrors({});
      updateState(s => ({
        ...s,
        kit,
        tracks: Object.fromEntries(
          TRACK_IDS.map(id => [id, { ...s.tracks[id], customFile: undefined }]),
        ) as BeatmakerState['tracks'],
      }));
    },
    [updateState],
  );

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      const preset = PRESETS[presetId];
      if (!preset) return;
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
        engine.start(() => stateRef.current);
      }
    },
    [updateState],
  );

  const handleStepToggle = useCallback(
    (trackId: TrackId, index: number) => {
      updateState(s => {
        const steps = s.tracks[trackId].steps.map((v, i) =>
          i === index ? !v : v,
        );
        return {
          ...s,
          tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], steps } },
        };
      });
    },
    [updateState],
  );

  const handleFileLoad = useCallback(
    async (trackId: TrackId, file: File) => {
      const engine = engineRef.current;
      if (!engine) return;
      try {
        await engine.init();
        await engine.loadCustomFile(trackId, file);
        updateState(s => ({
          ...s,
          tracks: {
            ...s.tracks,
            [trackId]: { ...s.tracks[trackId], customFile: file },
          },
        }));
        setDecodeErrors(e => ({ ...e, [trackId]: undefined }));
      } catch (error) {
        captureException(error);
        setDecodeErrors(e => ({
          ...e,
          [trackId]: t('track.decodeError'),
        }));
      }
    },
    [t, updateState],
  );

  const handleVolumeChange = useCallback(
    (trackId: TrackId, volume: number) => {
      updateState(s => ({
        ...s,
        tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], volume } },
      }));
    },
    [updateState],
  );

  const handlePanChange = useCallback(
    (trackId: TrackId, pan: number) => {
      updateState(s => ({
        ...s,
        tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], pan } },
      }));
    },
    [updateState],
  );

  const handleMuteToggle = useCallback(
    (trackId: TrackId) => {
      updateState(s => ({
        ...s,
        tracks: {
          ...s.tracks,
          [trackId]: { ...s.tracks[trackId], muted: !s.tracks[trackId].muted },
        },
      }));
    },
    [updateState],
  );

  const handleCopy = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      globalThis.navigator.clipboard?.writeText === undefined
    ) {
      return;
    }

    try {
      const currentState = stateRef.current;
      const hasCustom = TRACK_IDS.some(
        id => !!currentState.tracks[id].customFile,
      );
      const hash = encode(currentState, hasCustom);
      const url = `${globalThis.location.origin}${globalThis.location.pathname}#${hash}`;

      await globalThis.navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable (insecure context or permission denied); ignore silently
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <LandscapeGuard>
      <Section className="max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl font-bold uppercase sm:text-8xl xl:text-9xl">
          {t('metadata.title')}
        </h1>
      </Section>

      <Section>
        <div className="m-auto max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
          <div className="flex flex-col items-center gap-8">
            {showIOSWarning && (
              <div className="bg-warning border-warning text-warning-foreground dark:bg-warning/30 dark:border-warning dark:text-warning flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{t('iosWarning.title')}</p>
                  <p>{t('iosWarning.message')}</p>
                </div>
                <Button
                  size="sm"
                  variant="tertiary"
                  onPress={() => {
                    setDismissedIOSWarning(true);
                  }}
                >
                  {t('share.dismissNotice')}
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
                    void handlePlayToggle();
                  }}
                  onBpmChange={handleBpmChange}
                  onStepCountChange={handleStepCountChange}
                  onCopy={() => {
                    void handleCopy();
                  }}
                />
              </Card.Content>
            </Card>

            {/* Card 2: Options (Kit + Presets) */}
            <Card className="w-full">
              <Card.Content className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <KitSelector
                    activeKit={state.kit}
                    onKitChange={handleKitChange}
                  />
                  <Separator
                    className="my-auto h-5"
                    orientation="vertical"
                    variant="tertiary"
                  />
                  <PatternPresets onPresetSelect={handlePresetSelect} />
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
                    void handleFileLoad(trackId, file);
                  }}
                  decodeErrors={decodeErrors}
                  activeStep={activeStep}
                />
              </Card.Content>
            </Card>

            {/* Card 4: Mixer */}
            <Card className="w-full">
              <Card.Content className="p-2">
                <p className="mb-3 text-xs tracking-widest uppercase">
                  {t('mixer.title')}
                </p>
                <div className="grid grid-cols-6 gap-2.5">
                  {TRACK_IDS.map(trackId => (
                    <div
                      key={trackId}
                      className="border-default flex flex-col items-center rounded-xl border p-3"
                    >
                      <MixerStrip
                        trackId={trackId}
                        volume={state.tracks[trackId].volume}
                        pan={state.tracks[trackId].pan}
                        muted={state.tracks[trackId].muted}
                        onVolumeChange={v => {
                          handleVolumeChange(trackId, v);
                        }}
                        onPanChange={v => {
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
}
