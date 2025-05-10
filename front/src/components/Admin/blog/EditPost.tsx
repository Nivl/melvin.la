'use client';
import { useEffect, useState } from 'react';

import { Section } from '#components/Home/Section';
import { useGetPost } from '#hooks/blog/useGetPost';
import {
  Input as UpdatePostEndpointInput,
  useUpdatePost,
} from '#hooks/blog/useUpdatePost';

import { PostForm, ServerError } from './PostForm';

export const EditPost = ({ id }: { id: string }) => {
  // TODO(melvin): Handle 404s
  const { data: post, isLoading } = useGetPost({ slug: id });
  const {
    isPending: isCreatingPost,
    error: createPostError,
    updatePostAsync,
  } = useUpdatePost(id);

  const [serverError, setServerError] = useState<ServerError>({});
  useEffect(() => {
    if (createPostError) {
      const errors: ServerError = {};
      switch (createPostError.field) {
        case 'title':
          errors.title = createPostError.message;
          break;
        case 'slug':
          errors.slug = createPostError.message;
          break;
        case 'thumbnailUrl':
          errors.thumbnailUrl = createPostError.message;
          break;
        case 'description':
          errors.description = createPostError.message;
          break;
        default:
          errors._ = createPostError.message;
          break;
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
