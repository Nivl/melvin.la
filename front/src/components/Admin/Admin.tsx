'use client';

import { Button, Link } from '@heroui/react';
import { FaFeatherPointed as NewPostIcon } from 'react-icons/fa6';

import { ListPostPreviews } from '#components/blog/ListPostPreviews';
import { Section } from '#components/Home/Section';
import { useGetPosts } from '#hooks/blog/useGetPosts';

export const Admin = () => {
  // TODO(melvin): Implement client-side pagination (backend supports it).
  // The endpoint only returns the last 100 posts.
  const { data: posts, isLoading, error } = useGetPosts();

  const publishedPosts = posts?.filter(post => post.publishedAt);
  const draftPosts = posts?.filter(post => !post.publishedAt);

  return (
    <>
      <Section>
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Admin
        </h1>
      </Section>

      <Section>
        <Button
          color="primary"
          endContent={<NewPostIcon />}
          as={Link}
          href="/admin/blog/write-post"
        >
          {' '}
          Write a new blog post
        </Button>
      </Section>

      {!isLoading && draftPosts && draftPosts.length > 0 && (
        <Section>
          <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
            Draft articles
          </h2>

          <ListPostPreviews posts={draftPosts} isAdmin={true} />
        </Section>
      )}

      <Section>
        <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
          Published articles
        </h2>

        {error && <p className="text-red-500">An error occurred</p>}

        {publishedPosts && publishedPosts.length === 0 && (
          <ListPostPreviews posts={publishedPosts} isAdmin={true} />
        )}
      </Section>
    </>
  );
};
