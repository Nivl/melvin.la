import { $api } from '#backend/api';

export const useGetPost = ({
  slug,
  disabled = false,
}: {
  slug: string;
  disabled?: boolean;
}) => {
  const { isLoading, data, error } = $api.useQuery(
    'get',
    '/blog/posts/{idOrSlug}',
    {
      params: {
        path: { idOrSlug: slug },
      },
    },
    {
      enabled: !disabled,
    },
  );

  return {
    isLoading,
    error,
    data,
  };
};
