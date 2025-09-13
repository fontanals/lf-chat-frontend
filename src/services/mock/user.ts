import { UpdateUserRequest } from "../../models/requests/user";
import {
  GetUserResponse,
  UpdateUserResponse,
} from "../../models/responses/user";
import { IUserService } from "../user";
import { data } from "./data";

export class MockUserService implements IUserService {
  async getUser(): Promise<GetUserResponse> {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...data.users[0] }), 300)
    );
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        data.users[0] = { ...data.users[0], ...request };

        resolve(data.users[0].id);
      }, 300)
    );
  }
}
