'use client';

import { ListPostPreviews } from '#components/blog/ListPostPreviews';
import { Footer } from '#components/Home/Footer';
import { Section } from '#components/Home/Section';
import { useGetPosts } from '#hooks/blog/useGetPosts';

export const Blog = () => {
  // TODO(melvin): Implement client-side pagination (backend supports it).
  // The endpoint only returns the last 100 posts.
  const { data: posts, isLoading, error } = useGetPosts();

  return (
    <>
      <Section>
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Blog
        </h1>
      </Section>

      {/* TODO: handle loading */}
      {/* TODO: handle errors */}
      {/* TODO: handle when no posts */}
      {!isLoading && posts && posts.length > 0 && (
        <Section>
          <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
            Articles
          </h2>

          <ListPostPreviews posts={posts} />
        </Section>
      )}

      <Section>
        <Footer />
      </Section>
    </>
  );
};
