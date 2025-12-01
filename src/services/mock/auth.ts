import {
  RecoverPasswordRequest,
  ResetPasswordRequest,
  SigninRequest,
  SignupRequest,
  VerifyAccountRequest,
} from "../../models/requests/auth";
import {
  RecoverPasswordResponse,
  ResetPasswordResponse,
  SigninResponse,
  SignoutResponse,
  SignupResponse,
  VerifyAccountResponse,
} from "../../models/responses/auth";
import { ApplicationError } from "../../utils/errors";
import { IAuthService } from "../auth";
import { mockData } from "./data";

export class MockAuthService implements IAuthService {
  async verifyAccount(
    request: VerifyAccountRequest
  ): Promise<VerifyAccountResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        resolve(user.email);
      }, 300)
    );
  }

  async signup(request: SignupRequest): Promise<SignupResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = mockData.users[0];

        if (request.email === user.email) {
          return reject(ApplicationError.invalidEmailOrPassword());
        }

        resolve(request.email);
      }, 300)
    );
  }

  async signin(request: SigninRequest): Promise<SigninResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = mockData.users[0];

        if (request.email !== user.email) {
          return reject(ApplicationError.invalidEmailOrPassword());
        }

        resolve({ user: { ...user } });
      }, 300)
    );
  }

  async signout(): Promise<SignoutResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        resolve(user.id);
      }, 300)
    );
  }

  async recoverPassword(
    request: RecoverPasswordRequest
  ): Promise<RecoverPasswordResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        resolve(user.email);
      }, 300)
    );
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        resolve(user.email);
      }, 300)
    );
  }
}
