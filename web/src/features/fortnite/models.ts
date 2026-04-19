export enum AccountTypes {
  Epic = "epic",
  PSN = "psn",
  Xbox = "xbl",
}

export enum TimeWindow {
  Season = "season",
  Lifetime = "lifetime",
}

type CommonDetails = {
  score: number;
  scorePerMin: number;
  scorePerMatch: number;
  wins: number;
  kills: number;
  killsPerMin: number;
  killsPerMatch: number;
  deaths: number;
  kd: number;
  matches: number;
  winRate: number;
  minutesPlayed: number;
  playersOutlived: number;
  lastModified: string;
};

type OverallDetails = CommonDetails & {
  top3?: number | null;
  top5?: number | null;
  top6?: number | null;
  top10?: number | null;
  top12?: number | null;
  top25?: number | null;
};

type SoloDetails = CommonDetails & {
  top10?: number | null;
  top25?: number | null;
};

type DuoDetails = CommonDetails & {
  top5?: number | null;
  top12?: number | null;
};

type TrioDetails = null;

type SquadDetails = CommonDetails & {
  top3?: number | null;
  top6?: number | null;
};

type LtmDetails = CommonDetails;

type GameMode = {
  overall?: OverallDetails | null;
  solo?: SoloDetails | null;
  duo?: DuoDetails | null;
  // Trio is always null, but in case that changes in the future,
  // we want to make sure it's still nullable and that we don't introduce
  // a bug by forgetting to update it here.
  // eslint-disable-next-line typescript/no-duplicate-type-constituents
  trio?: TrioDetails;
  squad?: SquadDetails | null;
  ltm?: LtmDetails | null;
};

export type FortniteStatsData = {
  account: {
    id: string;
    name: string;
  };
  battlePass: {
    level: number;
    progress: number;
  };
  image?: string | null;
  stats: {
    all?: GameMode | null;
    keyboardMouse?: GameMode | null;
    gamepad?: GameMode | null;
    touch?: GameMode | null;
  };
};

export type FortniteAPIStatsResponse = {
  status: number;
  data: FortniteStatsData;
};

export function isAccountType(value: string): value is AccountTypes {
  return new Set<string>(Object.values(AccountTypes)).has(value);
}

export const hasStats = (
  data: FortniteStatsData | undefined,
): data is FortniteStatsData & {
  stats: NonNullable<FortniteStatsData["stats"]> & {
    all: NonNullable<FortniteStatsData["stats"]["all"]> & {
      overall: NonNullable<NonNullable<FortniteStatsData["stats"]["all"]>["overall"]>;
    };
  };
} => {
  return !!data?.stats?.all?.overall;
};

export type Preset = {
  accountName: string;
  accountType: AccountTypes;
  timeWindow: TimeWindow;
};

export const defaultPreset: Preset = {
  accountName: "",
  accountType: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
};
