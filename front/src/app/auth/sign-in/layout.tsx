import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Melvin Laplanche',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
