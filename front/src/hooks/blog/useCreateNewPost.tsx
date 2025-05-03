import { $api, baseHeaders, operations } from '#backend/api';

export type Input =
  operations['createBlogPost']['requestBody']['content']['application/json'];

export const useCreateNewPost = () => {
  const { isPending, data, isSuccess, mutateAsync, error } = $api.useMutation(
    'post',
    '/blog/posts',
  );

  return {
    isPending,
    error,
    isSuccess,
    data,
    // Temporary workaround until openapi-typescript supports securitySchemes
    // https://github.com/openapi-ts/openapi-typescript/issues/922
    createPostAsync: async (input: Input) => {
      return await mutateAsync({
        body: input,
        headers: {
          ...baseHeaders(),
        },
      });
    },
  };
};
