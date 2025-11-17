'use client';

import { useEffect, useState } from 'react';

export type UseMediaQueryOptions = {
  fallback?: boolean | undefined;
};

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {},
): boolean {
  const { fallback } = options;

  const [queryValue, setQueryValue] = useState<boolean>(() => {
    return globalThis.matchMedia === undefined
      ? (fallback ?? false)
      : globalThis.matchMedia(query).matches;
  });

  useEffect(() => {
    if (globalThis.matchMedia === undefined) {
      return;
    }

    const listener = (event: MediaQueryListEvent) => {
      setQueryValue(event.matches);
    };

    const mediaQueryList = globalThis.matchMedia(query);
    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  return queryValue;
}
