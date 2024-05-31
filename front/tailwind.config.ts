import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
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
      fortnite: ['Burbank Big Condensed Bold'],
    },
    colors: {
      brands: {
        playstation: '#006FCD',
        xbox: '#2ca243',
      },
      ...colors,
    },
    extend: {
      keyframes: {
        levitate: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        levitate: 'levitate 1s ease-in-out infinite',
      },
      colors: {
        accent: '#26ace6',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      defaultExtendTheme: 'dark',
    }),
  ],
};
export default config;
