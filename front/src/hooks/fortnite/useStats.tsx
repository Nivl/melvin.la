import { useQuery } from '@tanstack/react-query';

import { Data } from '#models/fortnite';

export class ErrorWithCode extends Error {
  code: ErrCode;

  constructor(message: string, code: ErrCode) {
    super(message);
    this.name = 'ErrorWithCode';
    this.code = code;
  }
}

export type APIResponse = {
  status: number;
  data: Data;
};

export enum ErrCode {
  AccountPrivate,
  AccountNotFound,
  SomethingWentWrong,
  InvalidAPIKey,
}

export const useStats = (
  accountName: string,
  accountType: string,
  timeWindow: string,
  disabled = false,
) => {
  const resp = useQuery({
    queryKey: ['fortnite', 'stats', accountName, accountType, timeWindow],
    enabled: !disabled && !!accountName && !!accountType && !!timeWindow,
    queryFn: async () => {
      const res = await fetch(
        `/api/fortnite?&name=${accountName}&accountType=${accountType}&timeWindow=${timeWindow}`,
      );

      switch (res.status) {
        case 401:
          throw new ErrorWithCode('Invalid API Key', ErrCode.InvalidAPIKey);
        case 403:
          throw new ErrorWithCode('Account is private', ErrCode.AccountPrivate);
        case 404:
          throw new ErrorWithCode(
            'Account does not exist',
            ErrCode.AccountNotFound,
          );
        default:
          if (res.status !== 200) {
            throw new ErrorWithCode(
              'Something went wrong',
              ErrCode.SomethingWentWrong,
            );
          }
      }
      const data = (await res.json()) as APIResponse;
      return data.data;
    },
  });

  return { data: resp.data, isLoading: resp.isLoading, error: resp.error };
};
