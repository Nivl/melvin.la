import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { List } from '#components/blog/List';
import { getLatestBlogPosts } from '#ssg/queries';
import { getMetadata } from '#utils/metadata';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getLatestBlogPosts();
  if (!posts || posts.length === 0) {
    return notFound();
  }

  return <List posts={posts} />;
}

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/blog',
    title: 'Blog',
    description: 'See the latest blog posts.',
  }),
};
