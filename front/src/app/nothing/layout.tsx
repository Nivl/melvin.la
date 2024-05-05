import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nothing',
  description: 'The Game where you do nothing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
