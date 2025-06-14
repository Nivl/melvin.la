import { notFound } from 'next/navigation';

import { Post as BlogPostC } from '#components/Blog/Post';
import { getLatestBlogPosts } from '#ssg/queries';

export default function Home() {
  const posts = getLatestBlogPosts();
  if (!posts || posts.length === 0) {
    return notFound();
  }

  return <BlogPostC content={posts[0].content} />;
}

export const dynamic = 'force-static';
