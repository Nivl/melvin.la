"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(
  query: string,
  options: { fallback?: boolean | undefined } = {},
): boolean {
  const { fallback } = options;
  const win = (globalThis as { window?: Window & typeof globalThis }).window;

  const [queryValue, setQueryValue] = useState<boolean>(() => {
    if (win === undefined || typeof win.matchMedia !== "function") {
      return fallback ?? false;
    }

    return win.matchMedia(query).matches;
  });

  useEffect(() => {
    const w = (globalThis as { window?: Window & typeof globalThis }).window;

    if (w === undefined || typeof w.matchMedia !== "function") {
      return undefined;
    }

    const listener = (event: MediaQueryListEvent) => {
      setQueryValue(event.matches);
    };

    const mediaQueryList = w.matchMedia(query);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return queryValue;
}
