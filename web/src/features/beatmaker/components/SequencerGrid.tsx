"use client";
import type { BeatmakerState, TrackId } from "#features/beatmaker/models/index.ts";
import { TRACK_IDS } from "#features/beatmaker/models/index.ts";

import { TrackRow } from "./TrackRow";

type SequencerGridProps = {
  tracks: BeatmakerState["tracks"];
  onStepToggle: (trackId: TrackId, index: number) => void;
  onFileLoad: (trackId: TrackId, file: File) => void;
  decodeErrors: Partial<Record<TrackId, string>>;
  activeStep: number | undefined;
};

export function SequencerGrid({
  tracks,
  onStepToggle,
  onFileLoad,
  decodeErrors,
  activeStep,
}: SequencerGridProps) {
  // Use first track to determine stepCount
  const stepCount = tracks.kick.steps.length;
  const groups = Array.from({ length: Math.ceil(stepCount / 4) }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max flex-col gap-2">
        {/* Step number header */}
        <div className="flex items-center gap-2">
          <div className="w-[72px] shrink-0" /> {/* label column spacer */}
          <div className="flex flex-1 items-center gap-3">
            {groups.map((gi) => (
              <div key={gi} className="flex gap-1.5">
                {[0, 1, 2, 3].map((si) => {
                  const n = gi * 4 + si + 1;

                  if (n > stepCount) {
                    return undefined;
                  }
                  return (
                    <div
                      key={si}
                      className={`flex h-4 w-9 items-center justify-center text-[9px] transition-colors ${gi * 4 + si === activeStep ? "font-bold text-default" : "text-default"}`}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {TRACK_IDS.map((trackId) => (
          <TrackRow
            key={trackId}
            trackId={trackId}
            steps={tracks[trackId].steps}
            onStepToggle={(index) => {
              onStepToggle(trackId, index);
            }}
            onFileLoad={(file) => {
              onFileLoad(trackId, file);
            }}
            hasCustomFile={!!tracks[trackId].customFile}
            decodeError={decodeErrors[trackId]}
            activeStep={activeStep}
          />
        ))}
      </div>
    </div>
  );
}
