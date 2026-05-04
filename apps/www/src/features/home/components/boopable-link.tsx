"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { usePrefersReducedMotion } from "#shared/hooks/use-prefers-reduced-motion";

export const BoopableLink = ({
  icon,
  label,
  link,
  className,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  link: string;
  className?: string;
  onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const [isBooped, setIsBooped] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <a
      onMouseEnter={() => {
        if (reduceMotion) {
          return;
        }
        setIsBooped(true);
      }}
      onClick={onClick}
      href={link}
      className={twMerge("flex items-center justify-center gap-4 border-none", className)}
    >
      <span
        className={`cls-boop-animation origin-bottom motion-safe:transition-all ${isBooped ? "rotate-15" : "rotate-0"}`}
      >
        {icon}
      </span>{" "}
      {label}
    </a>
  );
};
