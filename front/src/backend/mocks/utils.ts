import { HttpResponse, JsonBodyType } from 'msw';

export type MaybePromise<ValueType = unknown> = ValueType | Promise<ValueType>;

import { HttpError } from '#backend/types';

const codeMatchRegex = new RegExp(`^trigger-(?<code>\\d{3}).*$`);

export const fullURL = (path: string) => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL ?? ''}${path}`;
};

export const isErrCode = (value: string): boolean => {
  return codeMatchRegex.test(value);
};

export const errorCode = (
  value: string,
  field?: string,
): MaybePromise<HttpResponse<JsonBodyType>> => {
  const match = codeMatchRegex.exec(value);
  if (!match) {
    throw new Error(`Not an error code: ${value}`);
  }

  const code = parseInt(match?.groups?.code ?? '500');
  const resp = {
    message: `Self-triggered error ${code.toString()}`,
  } as HttpError;
  if (field && code !== 500 && code !== 401 && code !== 403) {
    resp.field = field;
  }

  return HttpResponse.json(resp, { status: code });
};
