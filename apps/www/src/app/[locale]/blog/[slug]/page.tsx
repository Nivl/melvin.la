import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { use } from "react";

import { Post } from "#features/blog/components/post";
import { getAllBlogPosts, getBlogPost } from "#features/blog/ssg/queries";
import { getMetadata } from "#shared/utils/metadata";

export default function Home(props: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = use(props.params);

  const post = getBlogPost(slug, locale);
  if (!post) {
    return notFound();
  }
  return <Post post={post} />;
}

// We make sure that any unknown slug will result in a 404 error
export const dynamicParams = false;

export const generateStaticParams = () =>
  getAllBlogPosts().map((post) => ({
    locale: post.language,
    slug: post.slug,
  }));

export const generateMetadata = async (props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> => {
  // read route params
  const { slug, locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "blog.metadata" });

  const post = getBlogPost(slug, locale);
  if (!post) {
    return await getMetadata({
      description: t("description"),
      locale,
      pageUrl: "/blog",
      title: t("title"),
    });
  }

  return {
    ...(await getMetadata({
      description: post.excerpt,
      extraOg: {
        modifiedTime: post.createdAt === post.updatedAt ? undefined : post.updatedAt,
        publishedTime: post.createdAt,
        type: "article",
      },
      imageURL: `/assets/blog/${post.slug}/${post.ogImage}${post.ogImageHash ? `?v=${post.ogImageHash}` : ""}`,
      locale,
      pageUrl: `/blog/${slug}`,
      title: post.title,
    })),
  };
};
