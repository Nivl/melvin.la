export type CellState = "on" | "off" | "state1" | "state2" | "state3" | "state4" | "state5";

export const CellColors: Record<CellState, string> = {
  off: "bg-zinc-200/40 dark:bg-zinc-900",
  on: "bg-accent",
  state1: "bg-pink-500 border-pink-500!",
  state2: "bg-amber-400 border-amber-500/70!",
  state3: "bg-green-400 border-green-400!",
  state4: "bg-blue-400 border-blue-500/70!",
  state5: "bg-foreground/50 border-foreground/30! dark:border-foreground/20!",
};
