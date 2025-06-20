import { notFound } from 'next/navigation';
import { use } from 'react';

import { Post } from '#components/blogg/Post';
import { getAllBlogPosts, getBlogPost } from '#ssg/queries';

export default function Home(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);

  const post = getBlogPost(slug);
  if (!post) {
    return notFound();
  }
  return <Post post={post} />;
}

// We make sure that any unknown slug will result in a 404 error
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({
    slug: post.slug,
  }));
}
