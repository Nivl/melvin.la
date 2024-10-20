import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timezone convertor',
  description: 'Compare timezones and convert time between them.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
