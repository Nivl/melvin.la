import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Fira_Code, Raleway } from 'next/font/google';
import localFont from 'next/font/local';

import { Navbar } from '#components/Navbar';
import { Providers } from '#components/Providers';
import { getMetadata } from '#utils/metadata';

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

const baikal = localFont({
  src: '../bundled_static/fonts/baikal_trial_ultra_condensed.woff2',
  variable: '--font-baikal',
});

const burbank = localFont({
  src: '../bundled_static/fonts/burbank_big_condensed_bold.woff2',
  variable: '--font-burbank',
});

const fonts = [raleway, firaCode, baikal, burbank];

export const metadata: Metadata = {
  ...getMetadata({}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`bg-background text-foreground ${fonts.map(font => font.variable).join(' ')}`}
    >
      <body className="h-full font-sans text-base font-light lining-nums leading-relaxed antialiased xl:text-xl xl:leading-relaxed">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
