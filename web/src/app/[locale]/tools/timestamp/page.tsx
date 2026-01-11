import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Timestamp } from '#components/Timestamp';
import { getMetadata } from '#utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'timestamp.metadata',
  });

  return await getMetadata({
    locale,
    pageUrl: '/tools/timestamp',
    title: t('title'),
    description: t('description'),
  });
}

export default function Home() {
  return <Timestamp />;
}
