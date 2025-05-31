'use client';

import { useEffect, useState } from 'react';

import { Section } from '#components/Home/Section';
import { useCreateNewPost } from '#hooks/blog/useCreateNewPost';
import { Input as CreatePostEndpointInput } from '#hooks/blog/useCreateNewPost';
import { Input as UpdatePostEndpointInput } from '#hooks/blog/useUpdatePost';

import { PostForm, ServerError } from './PostForm';

export const WritePost = () => {
  const {
    isPending: isCreatingPost,
    error: createPostError,
    createPostAsync,
  } = useCreateNewPost();

  // Parse the server errors
  const [serverError, setServerError] = useState<ServerError>({});
  useEffect(() => {
    if (createPostError) {
      const errors: ServerError = {};
      switch (createPostError.field) {
        case 'contentJson':
          errors.contentJson = createPostError.message;
          break;
        case 'description':
          errors.description = createPostError.message;
          break;
        case 'publish':
          errors.publish = createPostError.message;
          break;
        case 'slug':
          errors.slug = createPostError.message;
          break;
        case 'thumbnailUrl':
          errors.thumbnailUrl = createPostError.message;
          break;
        case 'title':
          errors.title = createPostError.message;
          break;
        default:
          errors._ = createPostError.message;
          break;
      }
      setServerError(errors);
    }
  }, [createPostError]);

  const onSubmit = async (
    data: CreatePostEndpointInput | UpdatePostEndpointInput,
  ) => {
    try {
      await createPostAsync(data as CreatePostEndpointInput);
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
