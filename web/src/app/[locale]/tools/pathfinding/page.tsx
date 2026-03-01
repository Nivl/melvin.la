import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Pathfinding } from '#components/Pathfinding';
import { getMetadata } from '#utils/metadata';

export default function PathfindingPage() {
  return <Pathfinding />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'pathfinding.metadata',
  });

  return await getMetadata({
    locale,
    pageUrl: '/tools/pathfinding',
    title: t('title'),
    description: t('description'),
  });
}
