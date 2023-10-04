import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

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
    <html lang="en">
      <body className="bg-black font-sans text-base font-light lining-nums leading-relaxed text-white antialiased xl:text-xl">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
