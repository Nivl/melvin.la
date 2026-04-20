export const getWindow = (): Window | undefined => {
  return (globalThis as { window?: Window & typeof globalThis }).window;
};
