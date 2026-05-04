import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

import { List } from "#features/blog/components/list";
import { getLatestBlogPosts } from "#features/blog/ssg/queries";
import { getMetadata } from "#shared/utils/metadata";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const posts = getLatestBlogPosts(locale);
  if (posts.length === 0) {
    return notFound();
  }

  return <List posts={posts} />;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.metadata" });

  return await getMetadata({
    description: t("description"),
    locale,
    pageUrl: "/blog",
    title: t("title"),
  });
};
