import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { StringLength } from '#components/StringLength';
import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/count',
    title: 'String Length',
    description:
      'Count characters and bytes in your text with our free online string length tool. Supports Unicode characters correctly.',
  }),
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StringLength />;
}
