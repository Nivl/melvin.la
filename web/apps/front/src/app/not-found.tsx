import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found :: Melvin Laplanche',
  description: "This page doesn't exist, sorry about that.",
};

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="flex">
        <span className="mr-6 border-r border-gray-200 pr-6">404</span>
        <span>Page not found</span>
      </h1>
    </div>
  );
}
