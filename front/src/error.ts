import { HttpError } from '#backend/types';

export class ErrorWithCode extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'ErrorWithCode';
    this.code = code;
  }
}

export class RequestError extends Error {
  info: HttpError;

  constructor(errInfo: HttpError, res: Response) {
    if (!errInfo.httpStatus) {
      errInfo.httpStatus = res.status;
    }
    super(errInfo.message, { cause: errInfo });
    this.info = errInfo;
  }
}
