// eslint-disable id-length
import { buildDefaultState } from "./presets";
import type { BeatmakerState, Kit, StepCount, TrackId } from "./types";
import { BPM_MAX, BPM_MIN, buildTrackRecord } from "./types";

// URL-safe base64: avoids +, /, = which get mangled in URLs
const toUrlBase64 = (str: string): string =>
  btoa(str).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

const fromUrlBase64 = (str: string): string => {
  const b64 = str.replaceAll("-", "+").replaceAll("_", "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
};

// Compact JSON key mapping
type Compact = {
  k: Kit;
  b: number; // bpm
  s: StepCount;
  c?: boolean; // hasCustomSamples
  //tracks
  t: Record<
    TrackId,
    {
      p: boolean[]; // steps
      v: number; // volume
      n: number; // pan
      m: boolean; // muted
    }
  >;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isKit = (value: unknown): value is Kit =>
  value === "808" || value === "acoustic" || value === "lofi";

const isStepCount = (value: unknown): value is StepCount =>
  value === 8 || value === 16 || value === 32;

export const encode = (state: BeatmakerState, hasCustomSamples = false): string => {
  const compact: Compact = {
    b: state.bpm,
    k: state.kit,
    s: state.stepCount,
    t: buildTrackRecord((id) => ({
      m: state.tracks[id].muted,
      n: state.tracks[id].pan,
      p: state.tracks[id].steps.slice(0, state.stepCount),
      v: state.tracks[id].volume,
    })),
  };
  if (hasCustomSamples) {
    compact.c = true;
  }
  return `v1:${toUrlBase64(JSON.stringify(compact))}`;
};

type DecodedState = Omit<BeatmakerState, "isPlaying"> & {
  hasCustomSamples: boolean;
};

export const decode = (hash: string): DecodedState | undefined => {
  try {
    if (!hash.startsWith("v1:")) {
      return undefined;
    }
    const json = fromUrlBase64(hash.slice(3));
    const parsed: unknown = JSON.parse(json);

    if (!isRecord(parsed)) {
      return undefined;
    }

    const { k: kit, b: bpm, s: stepCount, c: hasCustom, t: parsedTracks } = parsed;
    if (
      !isKit(kit) ||
      typeof bpm !== "number" ||
      !Number.isFinite(bpm) ||
      !isStepCount(stepCount) ||
      !isRecord(parsedTracks)
    ) {
      return undefined;
    }

    const bpmClamped = Math.max(BPM_MIN, Math.min(BPM_MAX, bpm));

    const defaults = buildDefaultState();

    return {
      bpm: bpmClamped,
      hasCustomSamples: hasCustom === true,
      kit,
      stepCount,
      tracks: buildTrackRecord<BeatmakerState["tracks"][TrackId]>((id) => {
        const trackValue = parsedTracks[id];
        if (!isRecord(trackValue)) {
          const defaultTrack = defaults.tracks[id];
          const defaultSteps = defaultTrack.steps;
          const normalizedSteps: boolean[] =
            defaultSteps.length === stepCount
              ? defaultSteps
              : defaultSteps.length > stepCount
                ? defaultSteps.slice(0, stepCount)
                : [
                    ...defaultSteps,
                    ...Array.from<boolean>({
                      length: stepCount - defaultSteps.length,
                    }).fill(false),
                  ];
          return {
            ...defaultTrack,
            customFile: undefined,
            steps: normalizedSteps,
          };
        }

        const rawSteps: boolean[] = Array.isArray(trackValue.p)
          ? Array.from(trackValue.p.slice(0, stepCount), Boolean)
          : defaults.tracks[id].steps;
        const steps: boolean[] =
          rawSteps.length === stepCount
            ? rawSteps
            : [
                ...rawSteps,
                ...Array.from<boolean>({ length: stepCount - rawSteps.length }).fill(false),
              ];
        const volume =
          typeof trackValue.v === "number" && Number.isFinite(trackValue.v)
            ? Math.max(0, Math.min(1, trackValue.v))
            : defaults.tracks[id].volume;
        const pan =
          typeof trackValue.n === "number" && Number.isFinite(trackValue.n)
            ? Math.max(-1, Math.min(1, trackValue.n))
            : defaults.tracks[id].pan;

        return {
          customFile: undefined,
          muted:
            typeof trackValue.m === "boolean" ? trackValue.m : defaults.tracks[id].muted,
          pan,
          steps,
          volume,
        };
      }),
    };
  } catch {
    return undefined;
  }
};
