'use client';
import { useEffect, useState } from 'react';

import { Section } from '#components/Home/Section';
import { RequestError, ServerErrors } from '#error';
import { useGetPost } from '#hooks/blog/useGetPost';
import {
  Input as UpdatePostEndpointInput,
  useUpdatePost,
} from '#hooks/blog/useUpdatePost';

import { PostForm } from './PostForm';

export const EditPost = ({ id }: { id: string }) => {
  const { data: post, isLoading, error } = useGetPost({ slug: id });
  const {
    isPending: isCreatingPost,
    error: createPostError,
    updatePostAsync,
  } = useUpdatePost(id);

  // TODO(melvin): Handle 404s

  const [serverError, setServerError] = useState<ServerErrors>({});
  useEffect(() => {
    if (createPostError) {
      const errors: ServerErrors = {};
      if (createPostError instanceof RequestError) {
        errors[createPostError.info.field ?? '_'] = [
          createPostError.info.message,
        ];
      } else if (createPostError instanceof Error) {
        errors['_'] = [createPostError.message ?? 'Unknown server error'];
      }
      setServerError(errors);
    }
  }, [createPostError]);

  const onSubmit = async (data: UpdatePostEndpointInput) => {
    try {
      await updatePostAsync(data);
    } catch (_) {
      // we can just return here because the sign up error will be handled
      // by the useSignUp hook
      return;
    }

    // TODO(melvin): redirect
  };

  return (
    <>
      <Section>
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Edit blog post
        </h1>
      </Section>

      {post && !isLoading && (
        <PostForm
          onSave={onSubmit}
          serverErrors={serverError}
          post={post}
          cta={{
            isDisabled: false,
            isPending: isCreatingPost,
            text: 'Update',
            textWhenPending: 'Updating Post...',
          }}
        />
      )}
    </>
  );
};
