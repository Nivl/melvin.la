export class ErrorWithCode extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'ErrorWithCode';
    this.code = code;
  }
}
