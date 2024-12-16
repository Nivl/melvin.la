'use client';

import { Footer } from '#components/Home/Footer';
import { Section } from '#components/Home/Section';
import { useGetPost } from '#hooks/blog/useGetPost';
import type { Block as BlockData } from '#models/block';

import { Block } from './blocks/Block';

export const Post = ({ slug }: { slug: string }) => {
  const { data: post, isLoading, error } = useGetPost({ slug });

  /* TODO: handle loading */
  /* TODO: handle errors */
  /* TODO: handle when no posts */

  return (
    <div id="blog-post-page">
      <Section>
        <h1 className="pb-8 pt-0 text-center text-2xl font-extrabold uppercase sm:w-auto sm:px-16 sm:pb-4 sm:text-4xl xl:px-28 xl:pb-8 xl:text-5xl">
          {post?.title}
        </h1>
      </Section>

      {!isLoading && (
        <Section>
          {post?.contentJson?.blocks.map((block, blockIndex) => {
            return <Block key={blockIndex} block={block as BlockData} />;
          })}
        </Section>
      )}

      <Section>
        <Footer />
      </Section>
    </div>
  );
};
