import type { Metadata } from 'next';

import { Uuid } from '#components/Uuid/Uuid.tsx';
import { getMetadata } from '#utils/metadata';

export default function Home() {
  return <Uuid />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getMetadata({
    locale,
    pageUrl: '/tools/uuid',
    title: 'UUID Generator',
    description:
      'Generate UUIDs easily with our free online UUID generator tool. Create unique identifiers for your projects in seconds.',
  });
}
