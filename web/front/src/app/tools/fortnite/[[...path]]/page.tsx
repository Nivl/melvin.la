import type { Metadata } from 'next';
import { use } from 'react';

import { AccountTypes } from '#components/fortnite/Form';
import { Fortnite } from '#components/fortnite/Fortnite';
import { getMetadata } from '#utils/metadata';

export default function Home(props: { params: Promise<{ path?: string[] }> }) {
  const { path } = use(props.params);
  return (
    <Fortnite
      providedName={path?.[0]}
      providedType={path?.[1] as AccountTypes | undefined}
    />
  );
}

export async function generateMetadata(props: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  // read route params
  const { path } = await props.params;
  if (!path || path.length === 0) {
    return {
      ...getMetadata({
        pageUrl: '/tools/fortnite',
        title: 'Fortnite Data',
        description: 'All the data from Fortnite',
        imageURL: '/assets/tools/fortnite/og.jpg',
      }),
    };
  }

  return {
    ...getMetadata({
      pageUrl: `/tools/fortnite/${path?.join('/')}`,
      title: `${decodeURI(path?.[0])}'s Fortnite Data`,
      description: `All the Fortnite data of ${decodeURI(path?.[0])}`,
      imageURL: `/assets/tools/fortnite/og.jpg`,
    }),
  };
}
