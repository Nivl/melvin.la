'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(
  query: string,
  options: { fallback?: boolean | undefined } = {},
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
  }, [query]);

  return queryValue;
}
