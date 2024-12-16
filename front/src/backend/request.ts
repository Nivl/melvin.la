import {
  MutationFunction,
  QueryFunction,
  QueryKey,
} from '@tanstack/react-query';

import { RequestError } from '#error';

export const userAccessTokenKey = 'user_access_token';

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
    headers.append('Authorization', `Bearer ${token}`);
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

export function errorWrapper<TData = unknown, TVariables = void>(
  fn: MutationFunction<TData, TVariables>,
): MutationFunction<TData, TVariables> {
  try {
    return fn;
  } catch (e) {
    if (e instanceof RequestError) {
      throw e;
    }
    // TODO(melvin): log the error somewhere
    throw new Error('Something went wrong');
  }
}

export function queryErrorWrapper<
  TData = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  fn: QueryFunction<TData, TQueryKey, TPageParam>,
): QueryFunction<TData, TQueryKey, TPageParam> {
  try {
    return fn;
  } catch (e) {
    if (e instanceof RequestError) {
      throw e;
    }
    // TODO(melvin): log the error somewhere
    throw new Error('Something went wrong');
  }
}

export const post = (
  path: string,
  input: unknown = {},
  queryParams?: QueryParams,
) => {
  const qParams = new URLSearchParams(queryParams);
  const url = fullURL(path) + qParams.toString();
  const request = baseRequest();
  request.method = 'POST';
  request.body = JSON.stringify(input);
  return fetch(url, request);
};

export const patch = (
  path: string,
  input: unknown = {},
  queryParams?: QueryParams,
) => {
  const qParams = new URLSearchParams(queryParams);
  const url = fullURL(path) + qParams.toString();
  const request = baseRequest();
  request.method = 'PATCH';
  request.body = JSON.stringify(input);
  return fetch(url, request);
};

export const del = (path: string, queryParams?: QueryParams) => {
  const qParams = new URLSearchParams(queryParams);
  const url = fullURL(path) + qParams.toString();
  const request = baseRequest();
  request.method = 'DELETE';
  return fetch(url, request);
};

export const get = (path: string, queryParams?: QueryParams) => {
  const qParams = new URLSearchParams(queryParams);
  const url = fullURL(path) + '?' + qParams.toString();
  const request = baseRequest();
  return fetch(url, request);
};

export const hasToken = () => {
  return !!window.localStorage.getItem(userAccessTokenKey);
};

export const deleteToken = () => {
  window.localStorage.removeItem(userAccessTokenKey);
};
