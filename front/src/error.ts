import { HttpError } from '#backend/types';

export class RequestError extends Error {
  info: HttpError;

  constructor(errInfo: HttpError, res: Response) {
    errInfo.httpStatus ??= res.status;
    super(errInfo.message, { cause: errInfo });
    this.info = errInfo;
  }
}
