import { OutputData } from '@editorjs/editorjs';
import { useMutation } from '@tanstack/react-query';

import { errorWrapper, post } from '#backend/request';
import { HttpError, Post } from '#backend/types';
import { RequestError } from '#error';

export type Input = {
  title: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  contentJson?: OutputData;
  publish?: boolean;
};

type Response = Post;

export const useCreateNewPost = () => {
  const { isPending, data, isSuccess, mutateAsync, mutate, error } =
    useMutation({
      mutationFn: errorWrapper(async (input: Input) => {
        const res = await post('/blog/posts', input);
        if (!res.ok) {
          const errInfo = (await res.json()) as HttpError;
          throw new RequestError(errInfo, res);
        }
        return (await res.json()) as Response;
      }),
    });

  return {
    isPending,
    error,
    isSuccess,
    data,
    createPostAsync: mutateAsync,
    createPost: mutate,
  };
};
