import { $api, baseHeaders, operations } from '#backend/api';

export type Input =
  operations['updateBlogPost']['requestBody']['content']['application/json'];

export const useUpdatePost = (id: string) => {
  const { isPending, data, isSuccess, mutateAsync, error } = $api.useMutation(
    'patch',
    `/blog/posts/{id}`,
  );

  return {
    isPending,
    error,
    isSuccess,
    data,
    // Temporary workaround until openapi-typescript supports securitySchemes
    // https://github.com/openapi-ts/openapi-typescript/issues/922
    updatePostAsync: async (input: Input) => {
      return await mutateAsync({
        body: input,
        headers: {
          ...baseHeaders(),
        },
        params: {
          path: { id },
        },
      });
    },
  };
};
