import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Timezones } from '#components/Timezones';
import { getMetadata } from '#utils/metadata';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Timezones />;
}

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timezones',
    title: 'Timezone converter',
    description: 'Compare timezones and convert time between them.',
  }),
};
