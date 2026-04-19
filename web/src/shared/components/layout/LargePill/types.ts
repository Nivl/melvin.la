export const colors = [
  "bg-pink-300",
  "bg-green-400",
  "bg-blue-400",
  "bg-amber-400",
  "bg-teal-300",
  "bg-sky-300",
  "bg-indigo-300",
  "bg-violet-300",
  "bg-rose-300",
] as const;

export type Color = (typeof colors)[number];
