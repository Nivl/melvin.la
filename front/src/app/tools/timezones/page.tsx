import type { Metadata } from 'next';

import { Timezones } from '#components/Timezones';
import { getMetadata } from '#utils/metadata';

export default function Home() {
  return <Timezones />;
}

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/tools/timezones',
    title: 'Timezone convertor',
    description: 'Compare timezones and convert time between them.',
  }),
};
