import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fortnite Data',
  description: 'All the data from Fortnite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
