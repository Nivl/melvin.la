import type { Metadata } from 'next';

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

export default function Home() {
  return <StringLength />;
}
