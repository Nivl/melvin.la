export const getWindow = (): Window | undefined =>
  (globalThis as { window?: Window & typeof globalThis }).window;
