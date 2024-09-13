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
