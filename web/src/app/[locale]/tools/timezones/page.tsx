import type { Metadata } from 'next';

import { Timezones } from '#components/Timezones';
import { getMetadata } from '#utils/metadata';

export default function Home() {
  return <Timezones />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getMetadata({
    locale,
    pageUrl: '/tools/timezones',
    title: 'Timezone converter',
    description: 'Compare timezones and convert time between them.',
  });
}
