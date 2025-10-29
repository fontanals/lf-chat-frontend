export enum ApplicationErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
  InvalidEmailOrPassword = 10000,
  UserMessageViolatesContentPolicy = 10001,
}

export class ApplicationError extends Error {
  code: ApplicationErrorCode;

  constructor(code: ApplicationErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  static badRequest(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.BadRequest,
      "Bad request."
    );
  }

  static unauthorized(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.Unauthorized,
      "Unauthorized."
    );
  }

  static notFound(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.NotFound,
      "Resource not found."
    );
  }

  static internalServerError(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.InternalServerError,
      "Internal server error."
    );
  }

  static invalidEmailOrPassword(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.InvalidEmailOrPassword,
      "Invalid email or password."
    );
  }

  static userMessageViolatesContentPolicy(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.UserMessageViolatesContentPolicy,
      "User message violates content policy."
    );
  }

  static copy(error: Error): ApplicationError {
    return new ApplicationError(
      (error as ApplicationError).code ??
        ApplicationErrorCode.InternalServerError,
      error.message
    );
  }
}
