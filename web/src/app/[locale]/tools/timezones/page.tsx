import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

  const t = await getTranslations({
    locale,
    namespace: 'timezones.metadata',
  });

  return await getMetadata({
    locale,
    pageUrl: '/tools/timezones',
    title: t('title'),
    description: t('description'),
  });
}
