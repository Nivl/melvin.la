import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

import { errorWrapper, post, userAccessTokenKey } from '#backend/request';
import { HttpError, Me, Session } from '#backend/types';
import { MeContext } from '#contexts/MeContext';
import { RequestError } from '#error';

export type Input = {
  email: string;
  password: string;
};

type Response = {
  me: Me;
  session: Session;
};

export const useSignIn = () => {
  const { setMe } = useContext(MeContext);

  const { isPending, data, isSuccess, mutateAsync, mutate, error } =
    useMutation({
      mutationFn: errorWrapper(async (input: Input) => {
        const res = await post('/auth/sessions', input);
        if (!res.ok) {
          const errInfo = (await res.json()) as HttpError;
          throw new RequestError(errInfo, res);
        }
        return (await res.json()) as Response;
      }),
    });

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
      const res = await mutateAsync(input);
      return res.me;
    },
    signIn: (input: Input, options?: MutateOptions<Me, unknown, Input>) => {
      mutate(input, {
        onError: options?.onError,
        onSettled: (data, error, variables, context) => {
          if (options?.onSettled) {
            const res = data?.me;
            options.onSettled(res, error, variables, context);
          }
        },
        onSuccess: (data, variables, context) => {
          if (options?.onSuccess) {
            const res = data.me;
            options.onSuccess(res, variables, context);
          }
        },
      });
    },
  };
};

export type MutateOptions<
  TData = Me,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = {
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
};
