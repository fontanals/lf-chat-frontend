export enum ApplicationErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
  InvalidEmailOrPassword = 1000,
  InvalidPassword = 1001,
  MaxUsersReached = 1002,
  MaxUserDocumentsReached = 1003,
}

export class ApplicationError extends Error {
  code: ApplicationErrorCode;

  constructor(code: ApplicationErrorCode, message: string) {
    super(message);
    this.code = code;
  }

  getStatusCode() {
    switch (this.code) {
      case ApplicationErrorCode.InvalidEmailOrPassword:
        return ApplicationErrorCode.BadRequest;
      default:
        return this.code;
    }
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

  static invalidPassword(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.InvalidPassword,
      "Invalid password."
    );
  }

  static maxUsersReached(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.MaxUsersReached,
      "Maximum number of users reached."
    );
  }

  static maxUserDocumentsReached(): ApplicationError {
    return new ApplicationError(
      ApplicationErrorCode.MaxUserDocumentsReached,
      "Maximum number of documents for the user reached."
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
