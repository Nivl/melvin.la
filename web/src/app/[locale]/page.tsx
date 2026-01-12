import type { Metadata } from 'next';

import { Home } from '#components/Home';
import { getMetadata } from '#utils/metadata';

import db from '../db.json';

export default function Page() {
  return <Home sections={db.sections} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return await getMetadata({
    locale,
  });
}
