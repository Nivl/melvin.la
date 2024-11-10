import { useQuery } from '@tanstack/react-query';

import { get, queryErrorWrapper } from '#backend/request';
import { HttpError, Post } from '#backend/types';
import { RequestError } from '#error';

type Response = Post;

export const useGetPost = ({
  slug,
  disabled = false,
}: {
  slug: string;
  disabled?: boolean;
}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['blog', 'post', slug],
    enabled: !disabled,
    queryFn: queryErrorWrapper(async () => {
      const res = await get('/blog/posts/' + slug);

      if (!res.ok) {
        const errInfo = (await res.json()) as HttpError;
        throw new RequestError(errInfo, res);
      }
      return (await res.json()) as Response;
    }),
  });

  return {
    isLoading,
    error,
    data,
  };
};
