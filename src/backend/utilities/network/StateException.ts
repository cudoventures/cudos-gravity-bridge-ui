export default class StateException extends Error {
  errorCode: number;
  msg: string;

  constructor(errorCode: number, msg: string = "") {
    super(`${errorCode}: ${msg}`);
    this.errorCode = errorCode;
    this.msg = msg;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StateException);
    }
  }
}
