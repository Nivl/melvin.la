import { buildDefaultState } from "./presets";
import type { BeatmakerState, Kit, StepCount, TrackId } from "./types";
import { BPM_MAX, BPM_MIN, buildTrackRecord } from "./types";

// URL-safe base64: avoids +, /, = which get mangled in URLs
function toUrlBase64(str: string): string {
  return btoa(str).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromUrlBase64(str: string): string {
  const b64 = str.replaceAll("-", "+").replaceAll("_", "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
}

// Compact JSON key mapping
type Compact = {
  k: Kit;
  b: number;
  s: StepCount;
  c?: boolean;
  t: Record<TrackId, { p: boolean[]; v: number; n: number; m: boolean }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isKit(value: unknown): value is Kit {
  return value === "808" || value === "acoustic" || value === "lofi";
}

function isStepCount(value: unknown): value is StepCount {
  return value === 8 || value === 16 || value === 32;
}

export function encode(state: BeatmakerState, hasCustomSamples = false): string {
  const compact: Compact = {
    k: state.kit,
    b: state.bpm,
    s: state.stepCount,
    t: buildTrackRecord((id) => ({
      p: state.tracks[id].steps.slice(0, state.stepCount),
      v: state.tracks[id].volume,
      n: state.tracks[id].pan,
      m: state.tracks[id].muted,
    })),
  };
  if (hasCustomSamples) compact.c = true;
  return `v1:${toUrlBase64(JSON.stringify(compact))}`;
}

type DecodedState = Omit<BeatmakerState, "isPlaying"> & {
  hasCustomSamples: boolean;
};

export function decode(hash: string): DecodedState | undefined {
  try {
    if (!hash.startsWith("v1:")) return undefined;
    const json = fromUrlBase64(hash.slice(3));
    const parsed: unknown = JSON.parse(json);

    if (!isRecord(parsed)) {
      return undefined;
    }

    const { k, b, s, c, t } = parsed;
    if (
      !isKit(k) ||
      typeof b !== "number" ||
      !Number.isFinite(b) ||
      !isStepCount(s) ||
      !isRecord(t)
    ) {
      return undefined;
    }

    const bpm = Math.max(BPM_MIN, Math.min(BPM_MAX, b));

    const defaults = buildDefaultState();

    return {
      kit: k,
      bpm,
      stepCount: s,
      hasCustomSamples: c === true,
      tracks: buildTrackRecord<BeatmakerState["tracks"][TrackId]>((id) => {
        const trackValue = t[id];
        if (!isRecord(trackValue)) {
          const defaultTrack = defaults.tracks[id];
          const defaultSteps = defaultTrack.steps;
          const normalizedSteps: boolean[] =
            defaultSteps.length === s
              ? defaultSteps
              : defaultSteps.length > s
                ? defaultSteps.slice(0, s)
                : [
                    ...defaultSteps,
                    ...Array.from<boolean>({
                      length: s - defaultSteps.length,
                    }).fill(false),
                  ];
          return {
            ...defaultTrack,
            steps: normalizedSteps,
            customFile: undefined,
          };
        }

        const rawSteps: boolean[] = Array.isArray(trackValue.p)
          ? Array.from(trackValue.p.slice(0, s), Boolean)
          : defaults.tracks[id].steps;
        const steps: boolean[] =
          rawSteps.length === s
            ? rawSteps
            : [...rawSteps, ...Array.from<boolean>({ length: s - rawSteps.length }).fill(false)];
        const volume =
          typeof trackValue.v === "number" && Number.isFinite(trackValue.v)
            ? Math.max(0, Math.min(1, trackValue.v))
            : defaults.tracks[id].volume;
        const pan =
          typeof trackValue.n === "number" && Number.isFinite(trackValue.n)
            ? Math.max(-1, Math.min(1, trackValue.n))
            : defaults.tracks[id].pan;

        return {
          steps,
          volume,
          pan,
          muted: typeof trackValue.m === "boolean" ? trackValue.m : defaults.tracks[id].muted,
          customFile: undefined,
        };
      }),
    };
  } catch {
    return undefined;
  }
}
