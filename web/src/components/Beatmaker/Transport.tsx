"use client";
import { Button, Separator, Slider, Tooltip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaPlay as PlayIcon, FaStop as StopIcon } from "react-icons/fa6";
import { LuShare2 } from "react-icons/lu";

import { BPM_MAX, BPM_MIN, STEP_COUNTS, type StepCount } from "#models/beatmaker";

type TransportProps = {
  isPlaying: boolean;
  bpm: number;
  stepCount: StepCount;
  copied: boolean;
  onPlayToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onStepCountChange: (steps: StepCount) => void;
  onCopy: () => void;
};

export function Transport({
  isPlaying,
  bpm,
  stepCount,
  copied,
  onPlayToggle,
  onBpmChange,
  onStepCountChange,
  onCopy,
}: TransportProps) {
  const tTransport = useTranslations("beatmaker.transport");
  const tShare = useTranslations("beatmaker.share");

  return (
    <div className="flex w-full items-center justify-between">
      {/* Play / Stop */}
      <Button
        className="m-auto"
        size="sm"
        variant={isPlaying ? "danger" : "primary"}
        onPress={onPlayToggle}
      >
        {isPlaying ? <StopIcon /> : <PlayIcon />}
        {isPlaying ? tTransport("stop") : tTransport("play")}
      </Button>

      <Separator variant="tertiary" className="my-auto h-5" orientation="vertical" />

      {/* Steps */}
      <div className="m-auto flex items-center gap-1.5">
        <span className="text-xs tracking-wider uppercase">{tTransport("steps")}</span>
        {STEP_COUNTS.map((n) => {
          const selected = stepCount === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onStepCountChange(n);
              }}
              className={[
                "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                "motion-safe:transition motion-safe:duration-150 motion-safe:ease-in-out",
                selected
                  ? "border-primary bg-accent text-accent-foreground"
                  : "hover:bg-default motion-safe:scale-85",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>

      <Separator variant="tertiary" className="my-auto h-5" orientation="vertical" />

      {/* BPM + Share (right side) */}
      <div className="m-auto flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs tracking-widest uppercase">{tTransport("bpm")}</span>
          <span className="font-mono font-bold text-foreground tabular-nums">{bpm}</span>
        </div>

        <Slider
          aria-label={tTransport("bpm")}
          className="w-32"
          minValue={BPM_MIN}
          maxValue={BPM_MAX}
          step={1}
          value={bpm}
          onChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            if (Number.isFinite(val)) {
              onBpmChange(val);
            }
          }}
        >
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>

      <Separator variant="tertiary" className="my-auto h-5" orientation="vertical" />

      {/* Share */}
      <Tooltip isOpen={copied}>
        <Button
          isIconOnly
          size="sm"
          className="m-auto"
          variant="outline"
          aria-label={tShare("copyUrl")}
          onPress={onCopy}
        >
          <LuShare2 />
        </Button>
        <Tooltip.Content showArrow placement="top">
          <Tooltip.Arrow />
          <p>{tShare("copied")}</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
