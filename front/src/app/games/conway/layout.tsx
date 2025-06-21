import type { Metadata } from 'next';

import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/games/conway',
    title: 'Game of Life',
    description: "Conway's Game of Life",
    imageURL: '/assets/games/conway/og.png',
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
