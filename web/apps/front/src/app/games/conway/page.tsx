import type { Metadata } from 'next';

import { Conway } from '#components/Conway';
import { getMetadata } from '#utils/metadata';

export default function Home() {
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
