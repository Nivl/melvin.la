import type { Metadata } from 'next';

import { Timestamp } from '#components/Timestamp';
import { getMetadata } from '#utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getMetadata({
    locale,
    pageUrl: '/tools/timestamp',
    title: 'Timestamp lookup',
    description: 'Turn timestamps into real date.',
  });
}

export default function Home() {
  return <Timestamp />;
}
