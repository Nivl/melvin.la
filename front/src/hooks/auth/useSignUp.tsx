import { useMutation } from '@tanstack/react-query';

import { errorWrapper, post } from '#backend/request';
import { HttpError } from '#backend/types';
import { RequestError } from '#error';

export type Input = {
  email: string;
  password: string;
  name: string;
};

export const useSignUp = () => {
  const mutation = useMutation<unknown, Error | RequestError, Input>({
    mutationFn: errorWrapper(async (input: Input) => {
      const res = await post('/users', input);
      if (!res.ok) {
        const errInfo = (await res.json()) as HttpError;
        throw new RequestError(errInfo, res);
      }
    }),
  });

  return {
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    signUpAsync: mutation.mutateAsync,
    signUp: mutation.mutate,
  };
};
