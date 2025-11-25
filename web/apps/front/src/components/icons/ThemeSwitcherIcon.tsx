import * as React from 'react';
import { useId } from 'react';

export const ThemeSwitcherIcon = ({
  theme,
  width,
  height,
  animationFocus,
  isBooped = false,
}: {
  theme: 'light' | 'dark';
  animationFocus: 'boop' | 'themeChange';
  width?: number;
  height?: number;
  isBooped?: boolean;
}) => {
  const maskId = useId();

  // Classes that applies to everything BUT the rays
  const baseClassName = 'transition-all duration-1000 ';
  const darkClassName = 'ease-spring-soft delay-400 ';
  const darkBoopedClassName = 'ease-spring-boop ';
  const lightClassName = ' ';
  const lightBoopedClassName = 'ease-spring-boop ';
  const className =
    baseClassName +
    (theme === 'dark'
      ? animationFocus === 'boop'
        ? darkBoopedClassName
        : darkClassName
      : animationFocus === 'boop'
        ? lightBoopedClassName
        : lightClassName);

  // Classes that applies to the rays only
  const rayBaseClassName = 'origin-center ';
  const rayDarkClassName =
    'cls-transition-theme-switch-dark scale-0 opacity-0 ';
  const rayLightBaseClassName = 'scale-100 opacity-100 ';
  const rayLightClassName = 'cls-transition-theme-switch-light ';
  const rayLightBoopedClassName =
    'ease-spring-boop transition-all duration-1000 ';
  // const rayLightBoopedClassName =
  //   'ease-spring-boop transition-all duration-1000 ';

  const rayClassName =
    rayBaseClassName +
    (theme === 'dark'
      ? rayDarkClassName // no boop animation on dark rays
      : animationFocus === 'boop'
        ? rayLightBaseClassName + rayLightBoopedClassName
        : rayLightBaseClassName + rayLightClassName);

  return (
    <svg
      viewBox="0 0 32 32"
      width={width ?? 32}
      height={height ?? 32}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={'block overflow-visible'}
    >
      <defs>
        <mask id={maskId}>
          {/* visible part */}
          <circle
            className={className}
            cx="16"
            cy="16"
            r={theme === 'dark' ? 12 : 8}
            fill="white"
            strokeWidth="0"
            stroke="currentColor"
          />

          {/* hidden part */}
          <circle
            className={className}
            cx="24"
            cy="8"
            r={theme === 'dark' ? (isBooped ? 10 : 8) : 0}
            fill="black"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* outside of the moon */}
        <circle
          className={className}
          cx="16"
          cy="16"
          r={theme === 'dark' ? 12 : 8}
          strokeWidth="5"
          stroke="currentColor"
        />

        {/* inside of the moon. */}
        <circle
          className={className}
          cx="24"
          cy="8"
          r={theme === 'dark' ? (isBooped ? 11 : 9) : 0}
          stroke="currentColor"
          strokeWidth="3"
        />
      </g>

      {/* Rays  */}
      <circle
        className={`${rayClassName} ${isBooped ? 'scale-110' : 'scale-100'}`}
        cx="16"
        cy="16"
        r={14}
        stroke="currentColor"
        strokeWidth={isBooped ? '5' : '4'}
        strokeDasharray="0,11"
        strokeLinecap="round"
      />
    </svg>
  );
};
