import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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
  params: Promise<{ path?: string[]; locale: string }>;
}): Promise<Metadata> {
  // read route params
  const { path, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'fortnite.metadata' });

  if (!path || path.length === 0) {
    return {
      ...(await getMetadata({
        locale,
        pageUrl: '/tools/fortnite',
        title: t('title'),
        description: t('description'),
        imageURL: '/assets/tools/fortnite/og.jpg',
      })),
    };
  }

  return {
    ...(await getMetadata({
      locale,
      pageUrl: `/tools/fortnite/${path?.join('/')}`,
      title: t('focusTitle', { username: decodeURI(path?.[0]) }),
      description: t('focusDescription', { username: decodeURI(path?.[0]) }),
      imageURL: `/assets/tools/fortnite/og.jpg`,
    })),
  };
}
