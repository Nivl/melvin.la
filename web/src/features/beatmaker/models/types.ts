export const KIT_IDS = ["808", "acoustic", "lofi"] as const;
export type Kit = (typeof KIT_IDS)[number];

export type TrackId = "kick" | "snare" | "hihat" | "openhat" | "clap" | "ride";

export const TRACK_IDS: TrackId[] = ["kick", "snare", "hihat", "openhat", "clap", "ride"];

export const buildTrackRecord = <T>(build: (trackId: TrackId) => T): Record<TrackId, T> => ({
  clap: build("clap"),
  hihat: build("hihat"),
  kick: build("kick"),
  openhat: build("openhat"),
  ride: build("ride"),
  snare: build("snare"),
});

export const STEP_COUNTS = [8, 16, 32] as const;
export type StepCount = (typeof STEP_COUNTS)[number];

export const BPM_MIN = 60;
export const BPM_MAX = 200;

export type TrackState = {
  steps: boolean[];
  volume: number; // 0.0–1.0
  pan: number; // -1.0 to +1.0
  muted: boolean;
  customFile?: File; // session-only, never serialised
};

export const TRACK_COLORS: Record<TrackId, string> = {
  clap: "var(--color-track-clap)",
  hihat: "var(--color-track-hihat)",
  kick: "var(--color-track-kick)",
  openhat: "var(--color-track-openhat)",
  ride: "var(--color-track-ride)",
  snare: "var(--color-track-snare)",
};

export type BeatmakerState = {
  kit: Kit;
  bpm: number;
  stepCount: StepCount;
  tracks: Record<TrackId, TrackState>;
  isPlaying: boolean;
};
