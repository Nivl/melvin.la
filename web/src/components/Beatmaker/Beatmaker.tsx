'use client';
import { Card, CardBody } from '@heroui/card';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Section } from '#components/layout/Section.tsx';
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
import { MixerStrip } from './MixerStrip';
import { PatternPresets } from './PatternPresets';
import { SequencerGrid } from './SequencerGrid';
import { Transport } from './Transport';

export function Beatmaker() {
  const t = useTranslations('beatmaker');
  const tKits = useTranslations('beatmaker.kits');

  const [state, setState] = useState<BeatmakerState>(() => {
    if (globalThis.window !== undefined) {
      const hash = globalThis.location.hash.replace('#', '');
      const decoded = decode(hash);
      if (decoded) {
        return { ...decoded, isPlaying: false };
      }
    }
    return buildDefaultState();
  });

  const [showCustomBanner] = useState(() => {
    if (globalThis.window !== undefined) {
      const hash = globalThis.location.hash.replace('#', '');
      const decoded = decode(hash);
      return decoded?.hasCustomSamples ?? false;
    }
    return false;
  });
  const [decodeErrors, setDecodeErrors] = useState<
    Partial<Record<TrackId, string>>
  >({});
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [activeStep, setActiveStep] = useState<number | undefined>();
  const engineRef = useRef<Engine | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const engine = createEngine({
      onError: captureException,
      onStep: setActiveStep,
    });
    engineRef.current = engine;
    return () => {
      engine.dispose();
    };
  }, []);

  // Load kit samples on mount and when kit changes
  useEffect(() => {
    void engineRef.current?.loadKit(state.kit);
  }, [state.kit]);

  // Sync URL hash on state change (debounced)
  useEffect(() => {
    const hasCustom = TRACK_IDS.some(id => !!state.tracks[id].customFile);
    const timer = setTimeout(() => {
      globalThis.location.hash = encode(state, hasCustom);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [state]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handlePlayToggle = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (state.isPlaying) {
      engine.stop();
      setActiveStep(undefined);
      setState(s => ({ ...s, isPlaying: false }));
    } else {
      await engine.init();
      engine.start(() => stateRef.current);
      setState(s => ({ ...s, isPlaying: true }));
    }
  }, [state.isPlaying]);

  const handleBpmChange = useCallback((bpm: number) => {
    setState(s => ({ ...s, bpm }));
  }, []);

  const handleStepCountChange = useCallback((stepCount: StepCount) => {
    setState(s => {
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
  }, []);

  const handleKitChange = useCallback((kit: Kit) => {
    setState(s => ({ ...s, kit }));
  }, []);

  const handlePresetSelect = useCallback((presetId: string) => {
    const preset = PRESETS[presetId];
    if (!preset) return;
    setState(s => ({ ...s, ...preset, isPlaying: s.isPlaying }));
    engineRef.current?.clearCustomFiles();
  }, []);

  const handleStepToggle = useCallback((trackId: TrackId, index: number) => {
    setState(s => {
      const steps = s.tracks[trackId].steps.map((v, i) =>
        i === index ? !v : v,
      );
      return {
        ...s,
        tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], steps } },
      };
    });
  }, []);

  const handleFileLoad = useCallback(
    async (trackId: TrackId, file: File) => {
      const engine = engineRef.current;
      if (!engine) return;
      try {
        await engine.init();
        await engine.loadCustomFile(trackId, file);
        setState(s => ({
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
    [t],
  );

  const handleVolumeChange = useCallback((trackId: TrackId, volume: number) => {
    setState(s => ({
      ...s,
      tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], volume } },
    }));
  }, []);

  const handlePanChange = useCallback((trackId: TrackId, pan: number) => {
    setState(s => ({
      ...s,
      tracks: { ...s.tracks, [trackId]: { ...s.tracks[trackId], pan } },
    }));
  }, []);

  const handleMuteToggle = useCallback((trackId: TrackId) => {
    setState(s => ({
      ...s,
      tracks: {
        ...s.tracks,
        [trackId]: { ...s.tracks[trackId], muted: !s.tracks[trackId].muted },
      },
    }));
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(globalThis.location.href);
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
    <>
      <Section className="max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl font-bold uppercase sm:text-8xl xl:text-9xl">
          Beatmaker
        </h1>
      </Section>

      <Section className="max-w-225 lg:max-w-225 xl:max-w-225 2xl:max-w-225">
        <div className="flex flex-col items-center gap-8">
          {/* Card 1: Transport + Share */}
          <Card className="w-full">
            <CardBody className="px-6 py-3">
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
            </CardBody>
          </Card>

          {/* Card 2: Options (Kit + Presets) */}
          <Card className="w-full">
            <CardBody className="flex flex-col gap-3 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <KitSelector
                  activeKit={state.kit}
                  onKitChange={handleKitChange}
                />
                <div className="bg-default-200 h-5 w-px" />
                <PatternPresets onPresetSelect={handlePresetSelect} />
              </div>
              {showCustomBanner && (
                <p className="text-warning text-sm">
                  {t('share.customSampleNotice', {
                    kit: tKits(state.kit),
                  })}
                </p>
              )}
            </CardBody>
          </Card>

          {/* Card 3: Sequencer */}
          <Card className="w-full">
            <CardBody className="px-6 py-4">
              <SequencerGrid
                tracks={state.tracks}
                onStepToggle={handleStepToggle}
                onFileLoad={(trackId, file) => {
                  void handleFileLoad(trackId, file);
                }}
                decodeErrors={decodeErrors}
                activeStep={activeStep}
              />
            </CardBody>
          </Card>

          {/* Card 4: Mixer */}
          <Card className="w-full">
            <CardBody className="px-6 py-4">
              <p className="text-default-400 mb-3 text-xs tracking-widest uppercase">
                {t('mixer.title')}
              </p>
              <div className="grid grid-cols-6 gap-2.5">
                {TRACK_IDS.map(trackId => (
                  <div
                    key={trackId}
                    className="border-default-200 flex flex-col items-center rounded-xl border bg-black/20 p-3"
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
            </CardBody>
          </Card>
        </div>
      </Section>
    </>
  );
}
