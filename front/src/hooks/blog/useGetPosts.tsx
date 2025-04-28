import { useQuery } from '@tanstack/react-query';

import { get, queryErrorWrapper } from '#backend/request';
import { HttpError, Post } from '#backend/types';
import { RequestError } from '#error';

type Response = Post[];

export const useGetPosts = ({
  after = '',
  before = '',
  disabled = false,
}: {
  after?: string;
  before?: string;
  disabled?: boolean;
} = {}) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['blog', 'posts', after, before],
    enabled: !disabled,
    queryFn: queryErrorWrapper(async () => {
      const res = await get('/blog/posts', { after, before });

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
