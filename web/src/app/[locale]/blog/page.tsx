import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { use } from 'react';

import { List } from '#components/blog/List';
import { getLatestBlogPosts } from '#ssg/queries';
import { getMetadata } from '#utils/metadata';

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const posts = getLatestBlogPosts(locale);
  if (!posts || posts.length === 0) {
    return notFound();
  }

  return <List posts={posts} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog.metadata' });

  return await getMetadata({
    locale,
    pageUrl: '/blog',
    title: t('title'),
    description: t('description'),
  });
}
