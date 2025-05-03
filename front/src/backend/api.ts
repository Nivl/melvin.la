export type { operations } from '../gen/api';
import { HeadersOptions } from 'openapi-fetch';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

import type { paths } from '../gen/api';

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
export const $api = createClient(fetchClient);

export const userAccessTokenKey = 'user_access_token';

export const baseHeaders = () => {
  const headers: HeadersOptions = {};

  const token = window.localStorage.getItem(userAccessTokenKey);
  if (token) {
    headers['X-Api-Key'] = token;
  }
  return headers;
};

export const hasToken = () => {
  return !!window.localStorage.getItem(userAccessTokenKey);
};

export const deleteToken = () => {
  window.localStorage.removeItem(userAccessTokenKey);
};
