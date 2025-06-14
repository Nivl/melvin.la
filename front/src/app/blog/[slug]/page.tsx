import { notFound } from 'next/navigation';
import { use } from 'react';

import { BlogPost } from '#components/Blog/BlogPost';
import { getAllBlogPosts, getBlogPost, getLatestBlogPosts } from '#ssg/queries';

export default function Home(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);

  if (slug) {
    const post = getBlogPost(slug);
    if (!post) {
      return notFound();
    }
    return <BlogPost content={post.content} />;
  }

  const posts = getLatestBlogPosts();
  return <BlogPost content={posts[0].content} />;
}

// We make sure that any unknown slug will result in a 404 error
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({
    slug: post.slug,
  }));
}
