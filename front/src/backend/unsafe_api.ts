import { userAccessTokenKey } from './api';

//
// /!\ Avoid importing this file use $api instead
//
// This file contains methods to use when you need a lower level API
// than the one provided by $api.
//
// Try really hard to use $api instead of this file.
//

type QueryParams =
  | string
  | Record<string, string>
  | URLSearchParams
  | string[][]
  | undefined;

const baseRequest = () => {
  const request: RequestInit = {
    method: 'GET',
  };

  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  const token = window.localStorage.getItem(userAccessTokenKey);
  if (token) {
    headers.append('X-Api-Key', token);
  }
  request.headers = headers;

  return request;
};

const fullURL = (path: string) => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL ?? ''}${path}`;
};

export const unsafeGetRequest = (path: string, queryParams?: QueryParams) => {
  const qParams = new URLSearchParams(queryParams);
  const url = fullURL(path) + '?' + qParams.toString();
  const request = baseRequest();
  return fetch(url, request);
};
