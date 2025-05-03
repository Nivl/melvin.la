import { useContext, useEffect } from 'react';

import { $api, baseHeaders, deleteToken } from '#backend/api';
import { MeContext } from '#contexts/MeContext';

export const useSignOut = () => {
  const { me, setMe } = useContext(MeContext);

  const { isPending, isSuccess, mutateAsync, error } = $api.useMutation(
    'delete',
    '/auth/sessions',
  );

  useEffect(() => {
    if (isSuccess) {
      // In the case where a token is set but invalid, me would be null,
      // but we still  want to delete the token from local storage,
      deleteToken();
      if (me) {
        setMe(null);
      }
    }
  }, [isSuccess, setMe, me]);

  return {
    isPending,
    error,
    isSuccess,
    // Temporary workaround until openapi-typescript supports securitySchemes
    // https://github.com/openapi-ts/openapi-typescript/issues/922
    signOutAsync: async () => {
      return mutateAsync({
        headers: {
          ...baseHeaders(),
        },
      });
    },
  };
};
