/* eslint-disable import/no-default-export */

import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        'Raleway',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      condensed: ['Baikal Trial Ultra Condensed'],
      fortnite: ['Burbank Big Condensed Bold'],
      monospace: ['Fira Code', 'monospace'],
    },
    extend: {
      lineHeight: {
        'tight-xl': '6rem',
        'tight-sm': '4.75rem',
        'tight-xs': '3rem',
      },
      colors: {
        accent: '#26ace6',
        brands: {
          playstation: '#006FCD',
          xbox: '#2ca243',
        },
      },
      keyframes: {
        levitate: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        levitate: 'levitate 1s ease-in-out infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      prefix: 'heroui',
      defaultExtendTheme: 'dark',
    }),
  ],
};
export default config;
