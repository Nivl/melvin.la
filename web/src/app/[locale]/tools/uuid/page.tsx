import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

  const t = await getTranslations({
    locale,
    namespace: 'uuid.metadata',
  });

  return await getMetadata({
    locale,
    pageUrl: '/tools/uuid',
    title: t('title'),
    description: t('description'),
  });
}
