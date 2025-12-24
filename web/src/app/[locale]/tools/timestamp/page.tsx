import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Timestamp } from '#components/Timestamp';
import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timestamp',
    title: 'Timestamp lookup',
    description: 'Turn timestamps into real date.',
  }),
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Timestamp />;
}
