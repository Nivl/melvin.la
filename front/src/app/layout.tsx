import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Melvin Laplanche',
  description:
    'Personal Website of Melvin Laplanche, nothing really interesting in there',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background text-foreground dark">
      <body className="h-full font-sans text-base font-light lining-nums leading-relaxed antialiased xl:text-xl xl:leading-relaxed">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
