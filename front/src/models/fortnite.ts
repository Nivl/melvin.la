export interface Data {
  account: Account;
  battlePass: BattlePass;
  image: string;
  stats: Stats;
}

export interface Account {
  id: string;
  name: string;
}

export interface BattlePass {
  level: number;
  progress: number;
}

export interface Stats {
  all: All;
  keyboardMouse: All | null;
  gamepad: All | null;
  touch: All | null;
}

export interface All {
  overall: Overall;
  solo: Overall | null;
  duo: Overall | null;
  trio: null;
  squad: Overall | null;
  ltm: Overall | null;
}

export interface Overall {
  score: number;
  scorePerMin: number;
  scorePerMatch: number;
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
  wins: number;
  top3?: number;
  top5?: number;
  top6?: number;
  top10?: number;
  top12?: number;
  top25?: number;
}
