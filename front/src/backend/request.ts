import { MutationFunction } from '@tanstack/react-query';

import { RequestError } from '#error';

export const userAccessTokenKey = 'user_access_token';

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
  if (path[0] !== '/') {
    path = `/${path}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
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

export const post = (path: string, input: unknown = {}) => {
  const request = baseRequest();
  request.method = 'POST';
  request.body = JSON.stringify(input);
  return fetch(fullURL(path), request);
};

export const del = (path: string) => {
  const request = baseRequest();
  request.method = 'DELETE';
  return fetch(fullURL(path), request);
};

export const get = (path: string) => {
  const request = baseRequest();
  return fetch(fullURL(path), request);
};

export const hasToken = () => {
  return !!window.localStorage.getItem(userAccessTokenKey);
};

export const deleteToken = () => {
  window.localStorage.removeItem(userAccessTokenKey);
};
