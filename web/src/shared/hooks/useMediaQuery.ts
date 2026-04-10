"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(
  query: string,
  options: { fallback?: boolean | undefined } = {},
): boolean {
  const { fallback } = options;

  const [queryValue, setQueryValue] = useState<boolean>(() => {
    if (globalThis.window === undefined || typeof globalThis.window.matchMedia !== "function") {
      return fallback ?? false;
    }

    return globalThis.window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (globalThis.window === undefined || typeof globalThis.window.matchMedia !== "function") {
      return;
    }

    const listener = (event: MediaQueryListEvent) => {
      setQueryValue(event.matches);
    };

    const mediaQueryList = globalThis.window.matchMedia(query);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return queryValue;
}
