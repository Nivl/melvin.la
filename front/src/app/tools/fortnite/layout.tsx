import type { Metadata } from 'next';

import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/fortnite',
    title: 'Fortnite Data',
    description: 'All the data from Fortnite',
    imageURL: '/assets/tools/fortnite/og.jpg',
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
