import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { List } from '#components/blog/List';
import { getLatestBlogPosts } from '#ssg/queries';
import { getMetadata } from '#utils/metadata';

export default function Home() {
  const posts = getLatestBlogPosts();
  if (!posts || posts.length === 0) {
    return notFound();
  }

  return <List posts={posts} />;
}

export const dynamic = 'force-static';

export const metadata: Metadata = {
  ...getMetadata({
    pageUrl: '/blog',
    title: 'Blog',
    description: 'See the latest blog posts.',
  }),
};
