import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

import { Post } from '#components/blog/Post';
import { getAllBlogPosts, getBlogPost } from '#ssg/queries';
import { getMetadata } from '#utils/metadata';

import { metadata as blogRootMetadata } from '../page';

export default function Home(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = use(props.params);
  setRequestLocale(locale);

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

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  // read route params
  const { slug } = await props.params;

  const post = getBlogPost(slug);
  if (!post) {
    return blogRootMetadata;
  }

  return {
    ...getMetadata({
      pageUrl: `/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      imageURL: `/assets/blog/${post.slug}/${post.ogImage}`,
      extraOg: {
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime:
          post.createdAt === post.updatedAt ? undefined : post.updatedAt,
      },
    }),
  };
}
