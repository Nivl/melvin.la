import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game of Life',
  description: "Conway's Game of Life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
