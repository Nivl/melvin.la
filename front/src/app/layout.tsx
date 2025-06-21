import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { Navbar } from '#components/Navbar';
import { Providers } from '#components/Providers';
import { getMetadata } from '#utils/metadata';

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
      className="bg-background text-foreground"
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
