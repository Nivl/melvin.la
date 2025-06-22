import type { Metadata } from 'next';

import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timezones',
    title: 'Timezone convertor',
    description: 'Compare timezones and convert time between them.',
    imageURL: '/assets/tools/timezones/og.png',
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
