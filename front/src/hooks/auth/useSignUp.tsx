import { $api, baseHeaders, operations } from '#backend/api';

export type Input = {
  email: string;
  password: string;
  name: string;
};

export const useSignUp = () => {
  const { isPending, error, isSuccess, mutateAsync } = $api.useMutation(
    'post',
    '/auth/users',
  );

  return {
    isPending: isPending,
    error: error,
    isSuccess: isSuccess,
    // Temporary workaround until openapi-typescript supports securitySchemes
    // https://github.com/openapi-ts/openapi-typescript/issues/922
    signUpAsync: async (
      input: operations['createUser']['requestBody']['content']['application/json'],
    ) => {
      return mutateAsync({
        body: input,
        headers: {
          ...baseHeaders(),
        },
      });
    },
  };
};
