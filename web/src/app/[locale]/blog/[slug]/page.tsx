import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { use } from 'react';

import { Post } from '#components/blog/Post';
import { getAllBlogPosts, getBlogPost } from '#ssg/queries';
import { getMetadata } from '#utils/metadata';

export default function Home(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = use(props.params);

  const post = getBlogPost(slug, locale);
  if (!post) {
    return notFound();
  }
  return <Post post={post} />;
}

// We make sure that any unknown slug will result in a 404 error
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({
    slug: post.key,
    locale: post.language,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  // read route params
  const { slug, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'blog.metadata' });

  const post = getBlogPost(slug, locale);
  if (!post) {
    return await getMetadata({
      locale,
      pageUrl: '/blog',
      title: t('title'),
      description: t('description'),
    });
  }

  return {
    ...(await getMetadata({
      locale,
      pageUrl: `/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      imageURL: `/assets/blog/${post.key}/${post.ogImage}`,
      extraOg: {
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime:
          post.createdAt === post.updatedAt ? undefined : post.updatedAt,
      },
    })),
  };
}
