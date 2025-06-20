import { notFound } from 'next/navigation';

import { List } from '#components/blogg/List';
import { getLatestBlogPosts } from '#ssg/queries';

export default function Home() {
  const posts = getLatestBlogPosts();
  if (!posts || posts.length === 0) {
    return notFound();
  }

  return <List posts={posts} />;
}

export const dynamic = 'force-static';
