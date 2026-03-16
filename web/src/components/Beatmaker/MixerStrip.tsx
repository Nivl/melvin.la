'use client';
import { Button } from '@heroui/button';
import { Slider } from '@heroui/slider';
import { useTranslations } from 'next-intl';

import { TRACK_COLORS, type TrackId } from '#models/beatmaker';

type MixerStripProps = {
  trackId: TrackId;
  volume: number;
  pan: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onPanChange: (v: number) => void;
  onMuteToggle: () => void;
};

export function MixerStrip({
  trackId,
  volume,
  pan,
  muted,
  onVolumeChange,
  onPanChange,
  onMuteToggle,
}: MixerStripProps) {
  const t = useTranslations('beatmaker.mixer');
  const tTracks = useTranslations('beatmaker.tracks');
  const color = TRACK_COLORS[trackId];

  return (
    <div className="flex flex-col items-center gap-2" data-track={trackId}>
      <span
        className="text-xs font-semibold tracking-wider uppercase"
        style={{ color }}
      >
        {tTracks(trackId)}
      </span>
      <Slider
        aria-label={t('volume')}
        minValue={0}
        maxValue={1}
        step={0.01}
        value={volume}
        onChange={v => {
          const val = Array.isArray(v) ? v[0] : v;
          if (Number.isFinite(val)) {
            onVolumeChange(val);
          }
        }}
        orientation="vertical"
        size="sm"
        className="h-24"
        classNames={{
          filler: 'bg-[var(--track-color)]',
          thumb: 'bg-[var(--track-color)]',
          track:
            'bg-default-200 data-[fill-start=true]:border-b-[color:var(--track-color)] data-[fill-end=true]:border-t-[color:var(--track-color)]',
        }}
        style={{ '--track-color': color } as React.CSSProperties}
      />
      <Slider
        aria-label={t('pan')}
        minValue={-1}
        maxValue={1}
        step={0.01}
        value={pan}
        fillOffset={0}
        onChange={v => {
          const val = Array.isArray(v) ? v[0] : v;
          if (Number.isFinite(val)) {
            onPanChange(val);
          }
        }}
        size="sm"
        className="w-full"
        classNames={{
          filler: 'bg-[var(--track-color)]',
          thumb: 'bg-[var(--track-color)]',
          track:
            'bg-default-200 data-[fill-start=true]:border-l-[color:var(--track-color)] data-[fill-end=true]:border-r-[color:var(--track-color)]',
        }}
        style={{ '--track-color': color } as React.CSSProperties}
      />
      <Button
        size="sm"
        variant={muted ? 'solid' : 'bordered'}
        color="default"
        onPress={onMuteToggle}
        className="w-full text-[10px]"
        style={muted ? { backgroundColor: color, color: '#fff' } : undefined}
      >
        {t('mute')}
      </Button>
    </div>
  );
}
