import type { Metadata } from 'next';

import { Uuid } from '#components/Uuid/Uuid.tsx';
import { getMetadata } from '#utils/metadata';

export default function Home() {
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
