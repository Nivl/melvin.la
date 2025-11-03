import { useMediaQuery } from '@uidotdev/usehooks';

export const usePrefersReducedMotion = () => {
  return !useMediaQuery('(prefers-reduced-motion: no-preference)');
};
