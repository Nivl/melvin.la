import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Conway } from '#components/Conway';
import { getMetadata } from '#utils/metadata';

export default function Home() {
  return <Conway />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'conway.metadata' });

  return await getMetadata({
    locale,
    pageUrl: '/games/conway',
    title: t('title'),
    description: t('description'),
  });
}
