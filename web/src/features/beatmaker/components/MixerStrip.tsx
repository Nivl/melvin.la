"use client";
import { Button, NumberField, Slider } from "@heroui/react";
import { useTranslations } from "next-intl";

import { TRACK_COLORS, type TrackId } from "#features/beatmaker/models/index.ts";

type TrackStyle = React.CSSProperties & Record<"--track-color", string>;

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
  const t = useTranslations("beatmaker.mixer");
  const tTracks = useTranslations("beatmaker.tracks");
  const color = TRACK_COLORS[trackId];
  const trackStyle: TrackStyle = { "--track-color": color };

  return (
    <div className="flex flex-col items-center gap-2" data-track={trackId}>
      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color }}>
        {tTracks(trackId)}
      </span>

      <Slider
        aria-label={t("volume")}
        maxValue={1}
        minValue={0}
        step={0.01}
        orientation="vertical"
        className="h-28"
        value={volume}
        onChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          if (Number.isFinite(val)) {
            onVolumeChange(val);
          }
        }}
        style={trackStyle}
      >
        <Slider.Track className="data-[fill-end=true]:border-t-[color:var(--track-color)] data-[fill-start=true]:border-b-[color:var(--track-color)]">
          <Slider.Fill className="bg-[var(--track-color)]" />
          <Slider.Thumb className="bg-[var(--track-color)]" />
        </Slider.Track>
      </Slider>

      <NumberField
        aria-label={t("pan")}
        maxValue={1}
        minValue={-1}
        step={0.01}
        value={pan}
        onChange={(v) => {
          if (Number.isFinite(v)) {
            onPanChange(v);
          }
        }}
      >
        <NumberField.Group className="grid-cols-[1fr_2fr_1fr]">
          <NumberField.DecrementButton className="h-5 w-5" />
          <NumberField.Input />
          <NumberField.IncrementButton className="h-5 w-5" />
        </NumberField.Group>
      </NumberField>

      <Button
        size="sm"
        variant={muted ? "primary" : "outline"}
        onPress={onMuteToggle}
        className="mt-2.5 w-full text-xs"
        style={muted ? { backgroundColor: color, color: "#fff" } : undefined}
      >
        {t("mute")}
      </Button>
    </div>
  );
}
