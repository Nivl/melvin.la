"use client";

import { useEffect, useState } from "react";

import { getWindow } from "#shared/utils/window";

export const useMediaQuery = (
  query: string,
  options: { fallback?: boolean | undefined } = {},
): boolean => {
  const { fallback } = options;
  const win = getWindow();

  const [queryValue, setQueryValue] = useState<boolean>(() => {
    if (win === undefined || typeof win.matchMedia !== "function") {
      return fallback ?? false;
    }

    return win.matchMedia(query).matches;
  });

  useEffect(() => {
    const window = getWindow();

    if (window === undefined || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const listener = (event: MediaQueryListEvent) => {
      setQueryValue(event.matches);
    };

    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return queryValue;
};
