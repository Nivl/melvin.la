import { useContext, useEffect } from 'react';

import {
  $api,
  baseHeaders,
  operations,
  userAccessTokenKey,
} from '#backend/api';
import { MeContext } from '#contexts/MeContext';

export type Input =
  operations['createSession']['requestBody']['content']['application/json'];

export const useSignIn = () => {
  const { setMe } = useContext(MeContext);

  const { isPending, data, isSuccess, mutateAsync, error } = $api.useMutation(
    'post',
    '/auth/sessions',
  );

  useEffect(() => {
    if (data) {
      localStorage.setItem(userAccessTokenKey, data.session.token);
      setMe(data.me);
    }
  }, [data, setMe]);

  return {
    isPending,
    error,
    isSuccess,
    data: data?.me,
    signInAsync: async (input: Input) => {
      const res = await mutateAsync({
        body: input,
        // Temporary workaround until openapi-typescript supports securitySchemes
        // https://github.com/openapi-ts/openapi-typescript/issues/922
        headers: {
          ...baseHeaders(),
        },
      });
      return res.me;
    },
  };
};
