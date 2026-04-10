"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { TRACK_COLORS, type TrackId } from "#features/beatmaker/models/index.ts";

type TrackRowProps = {
  trackId: TrackId;
  steps: boolean[];
  onStepToggle: (index: number) => void;
  onFileLoad: (file: File) => void;
  hasCustomFile: boolean;
  decodeError?: string;
  activeStep: number | undefined;
};

export function TrackRow({
  trackId,
  steps,
  onStepToggle,
  onFileLoad,
  hasCustomFile,
  decodeError,
  activeStep,
}: TrackRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("beatmaker.track");
  const tTracks = useTranslations("beatmaker.tracks");
  const tA11y = useTranslations("beatmaker.a11y");
  const color = TRACK_COLORS[trackId];

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileLoad(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
      // Reset so the same file can be re-selected to replace/retry
      e.target.value = "";
    }
  }

  // Split steps into groups of 4 for beat-grouping gaps
  const groups: boolean[][] = [];
  for (let i = 0; i < steps.length; i += 4) {
    groups.push(steps.slice(i, i + 4));
  }

  return (
    <div className="flex items-center gap-2">
      {/* Track label / file drop zone */}
      <button
        type="button"
        className="flex w-[72px] shrink-0 cursor-pointer flex-col items-center justify-center rounded px-1 py-1 text-center transition-opacity select-none hover:opacity-80"
        style={{ color }}
        title={hasCustomFile ? t("customFile") : t("dropFile")}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
      >
        <span className="text-xs font-semibold tracking-wider uppercase">{tTracks(trackId)}</span>
        {hasCustomFile && <span className="text-[8px] opacity-60">{t("customBadge")}</span>}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* Step buttons with beat-group gaps */}
      <div className="flex flex-1 items-center gap-3">
        {groups.map((group, gi) => (
          // the grid is automatically generated, so we
          // don't have anything else to use as key than the coordinates.
          // eslint-disable-next-line react/no-array-index-key
          <div key={gi} className="flex gap-1.5">
            {group.map((active, si) => {
              const index = gi * 4 + si;
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={tA11y("stepButton", {
                    track: tTracks(trackId),
                    step: index + 1,
                    state: active ? tA11y("stepOn") : tA11y("stepOff"),
                  })}
                  aria-pressed={active}
                  className={[
                    "h-9 w-9 shrink-0 rounded transition-all",
                    !active &&
                      (index === activeStep
                        ? "dark:bg-foreground/30 bg-foreground/10"
                        : "dark:bg-default bg-default/50 hover:bg-default hover:dark:bg-default/50"),
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    active
                      ? {
                          background: color,
                          boxShadow:
                            index === activeStep
                              ? `0 0 16px ${color}, 0 0 6px #fff4`
                              : `0 0 8px color-mix(in srgb, ${color} 60%, transparent)`,
                          opacity: index === activeStep ? 1 : 0.85,
                        }
                      : undefined
                  }
                  onClick={() => {
                    onStepToggle(index);
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {decodeError && <p className="ml-2 text-xs text-danger">{decodeError}</p>}
    </div>
  );
}
