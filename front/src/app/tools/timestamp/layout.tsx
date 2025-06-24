import type { Metadata } from 'next';

import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timestamp',
    title: 'Timestamp lookup',
    description: 'Turn timestamps into real date.',
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
