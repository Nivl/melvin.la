import type { Metadata } from 'next';

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
  return await getMetadata({
    locale,
    pageUrl: '/games/conway',
    title: 'Game of Life',
    description: "Conway's Game of Life",
    imageURL: '/assets/games/conway/og.png',
  });
}
