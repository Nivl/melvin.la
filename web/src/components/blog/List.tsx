import { useTranslations } from "next-intl";

import { PostDetails } from "#components/blog/PostDetails";
import { Section } from "#components/layout/Section";
import { BlogPost } from "#models/blog/post";

export function List({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blog");

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("listTitle")}
        </h1>
      </Section>
      <Section>
        <div className="my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostDetails key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </>
  );
}
