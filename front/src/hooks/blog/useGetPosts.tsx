import { $api, baseHeaders } from '#backend/api';

export const useGetPosts = ({
  after = '',
  before = '',
  disabled = false,
}: {
  after?: string;
  before?: string;
  disabled?: boolean;
} = {}) => {
  const { isLoading, data, error } = $api.useQuery(
    'get',
    '/blog/posts',
    {
      params: {
        query: {
          after,
          before,
        },
        // Temporary workaround until openapi-typescript supports securitySchemes
        // https://github.com/openapi-ts/openapi-typescript/issues/922
        headers: {
          ...baseHeaders(),
        },
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
