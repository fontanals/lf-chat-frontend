import { v4 as uuid } from "uuid";
import { Session } from "../../models/entities/session";
import { User } from "../../models/entities/user";
import { SigninRequest, SignupRequest } from "../../models/requests/auth";
import { SigninReponse, SignupResponse } from "../../models/responses/auth";
import { ApplicationError } from "../../utils/errors";
import { IAuthService } from "../auth";
import { data } from "./data";

export class MockAuthService implements IAuthService {
  async signup(request: SignupRequest): Promise<SignupResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const isDuplicate = data.users.some(
          (user) => user.email === request.email
        );

        if (isDuplicate) {
          return reject(ApplicationError.invalidEmailOrPassword());
        }

        const user: User = {
          id: uuid(),
          name: request.name,
          email: request.email,
        };

        const session: Session = { id: uuid(), userId: user.id };

        data.users.push(user);
        data.sessions.push(session);

        resolve({ session: { ...session }, user: { ...user } });
      }, 300)
    );
  }

  async signin(request: SigninRequest): Promise<SigninReponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = data.users.find((user) => user.email === request.email);

        if (user == null) {
          return reject(ApplicationError.invalidEmailOrPassword());
        }

        const session: Session = { id: uuid(), userId: user.id };

        data.sessions.push(session);

        resolve({ session: { ...session }, user: { ...user } });
      }, 300)
    );
  }
}
