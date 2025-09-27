import { SigninRequest, SignupRequest } from "../../models/requests/auth";
import {
  SigninReponse,
  SignoutResponse,
  SignupResponse,
} from "../../models/responses/auth";
import { ApplicationError } from "../../utils/errors";
import { IAuthService } from "../auth";
import { data } from "./data";

export class MockAuthService implements IAuthService {
  async signup(request: SignupRequest): Promise<SignupResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = data.users[0];

        if (request.email !== user.email) {
          return reject(ApplicationError.invalidEmailOrPassword());
        }

        resolve({ user: { ...user } });
      }, 300)
    );
  }

  async signin(request: SigninRequest): Promise<SigninReponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = data.users[0];

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
        const user = data.users[0];

        resolve(user.id);
      }, 300)
    );
  }
}
