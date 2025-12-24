import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { Conway } from '#components/Conway';
import { getMetadata } from '#utils/metadata';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Conway />;
}

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/games/conway',
    title: 'Game of Life',
    description: "Conway's Game of Life",
    imageURL: '/assets/games/conway/og.png',
  }),
};
