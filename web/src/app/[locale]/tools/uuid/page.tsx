import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Uuid } from '#components/Uuid/Uuid.tsx';
import { getMetadata } from '#utils/metadata';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Uuid />;
}

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/uuid',
    title: 'UUID Generator',
    description:
      'Generate UUIDs easily with our free online UUID generator tool. Create unique identifiers for your projects in seconds.',
  }),
};
