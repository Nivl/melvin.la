import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

import { del, deleteToken, errorWrapper } from '#backend/request';
import { HttpError } from '#backend/types';
import { MeContext } from '#contexts/MeContext';
import { RequestError } from '#error';

export type Input = {
  skipNetwork: boolean;
};

export const useSignOut = () => {
  const { me, setMe } = useContext(MeContext);

  const { isPending, isSuccess, mutateAsync, mutate, error } = useMutation({
    mutationFn: errorWrapper(async (input?: Input) => {
      if (input?.skipNetwork) {
        return;
      }

      const res = await del('/auth/sessions');
      if (!res.ok) {
        const errInfo = (await res.json()) as HttpError;
        throw new RequestError(errInfo, res);
      }
    }),
  });

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
    signOut: mutate,
    signOutAsync: mutateAsync,
  };
};
