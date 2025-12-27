import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { StringLength } from '#components/StringLength';
import { getMetadata } from '#utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'stringLength.metadata',
  });

  return await getMetadata({
    locale,
    pageUrl: '/tools/string-length',
    title: t('title'),
    description: t('description'),
  });
}

export default function Home() {
  return <StringLength />;
}
