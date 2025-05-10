import { $api, baseHeaders } from '#backend/api';

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
