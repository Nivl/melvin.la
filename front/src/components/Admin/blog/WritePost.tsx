'use client';

import { useEffect, useState } from 'react';

import { Section } from '#components/Home/Section';
import { RequestError, ServerErrors } from '#error';
import { useCreateNewPost } from '#hooks/blog/useCreateNewPost';
import { Input as CreatePostEndpointInput } from '#hooks/blog/useCreateNewPost';

import { PostForm } from './PostForm';

export const WritePost = () => {
  const {
    isPending: isCreatingPost,
    error: createPostError,
    createPostAsync,
  } = useCreateNewPost();

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

  const onSubmit = async (data: CreatePostEndpointInput) => {
    try {
      await createPostAsync(data);
    } catch (_) {
      // we can just return here because the sign up error will be handled
      // by the useSignUp hook
      return;
    }

    // TODO(melvin): redirect to the new post
  };

  return (
    <>
      <Section>
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Write a new blog post
        </h1>
      </Section>

      <PostForm
        onSave={onSubmit}
        serverErrors={serverError}
        cta={{
          isDisabled: true,
          isPending: isCreatingPost,
          text: 'Create',
          textWhenPending: 'Creating post...',
        }}
      />
    </>
  );
};
