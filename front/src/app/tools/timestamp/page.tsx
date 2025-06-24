import type { Metadata } from 'next';

import { Timestamp } from '#components/Timestamp';
import { getMetadata } from '#utils/metadata';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timestamp',
    title: 'Timestamp lookup',
    description: 'Turn timestamps into real date.',
  }),
};

export default function Home() {
  return <Timestamp />;
}
