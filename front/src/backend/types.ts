import { OutputData } from '@editorjs/editorjs';

export type Me = {
  id: string;
  email: string;
  name: string;
};

export type Session = {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string; // TODO(melvin): use Date or something parsable
};

export type HttpError = {
  message: string;
  field?: string;
  httpStatus?: number;
};

export type UnpublishedPost = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
  contentJson?: OutputData;
  publishedAt: null | undefined;
};

export type PublishedPost = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  contentJson: OutputData;
  publishedAt: string;
};

export type Post = UnpublishedPost | PublishedPost;
