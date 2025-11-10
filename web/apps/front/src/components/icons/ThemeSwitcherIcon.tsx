import * as React from 'react';

export const ThemeSwitcherIcon = ({
  theme,
  width,
  height,
}: {
  theme: 'light' | 'dark';
  width?: number;
  height?: number;
}) => (
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
      <mask id="mask">
        {/* visible part */}
        <circle
          className={`${theme === 'dark' ? 'ease-spring-soft delay-200' : ''} transition-all duration-500`}
          cx="16"
          cy="16"
          r={theme === 'dark' ? 12 : 5}
          fill="white"
          stroke="currentColor"
        />
        {/* hidden part */}
        <circle
          className={`${theme === 'dark' ? 'ease-spring-soft delay-200' : ''} transition-all duration-500`}
          cx="24"
          cy="8"
          r={theme === 'dark' ? 8 : 0}
          fill="black"
        />
      </mask>
    </defs>

    <g mask="url(#mask)">
      {/* outside of the moon */}
      <circle
        className={`${theme === 'dark' ? 'ease-spring-soft delay-200' : ''} transition-all duration-500`}
        cx="16"
        cy="16"
        r={theme === 'dark' ? 12 : 6}
        fill="none"
        stroke="currentColor"
      />
      {/* inside of the moon */}
      <circle
        className={`${theme === 'dark' ? 'ease-spring-soft delay-200' : ''} transition-all duration-500`}
        cx="24"
        cy="8"
        r={theme === 'dark' ? 9 : 0}
        stroke="currentColor"
      />
    </g>

    {/* Rays  */}
    <circle
      className={`${theme === 'dark' ? 'scale-0 opacity-0' : 'ease-spring-soft scale-100 opacity-100 delay-200'} origin-center transition-all duration-500`}
      cx="16"
      cy="16"
      r={14}
      stroke="currentColor"
      fill="none"
      strokeWidth="4"
      strokeDasharray="0,11"
      strokeLinecap="round"
    />
  </svg>
);
