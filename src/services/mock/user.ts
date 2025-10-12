import { UpdateUserRequest } from "../../models/requests/user";
import {
  GetUserResponse,
  UpdateUserResponse,
} from "../../models/responses/user";
import { IUserService } from "../user";
import { mockData } from "./data";

export class MockUserService implements IUserService {
  async getUser(): Promise<GetUserResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        resolve({ ...user });
      }, 300)
    );
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user = mockData.users[0];

        mockData.users[0] = { ...user, ...request, updatedAt: new Date() };

        resolve(user.id);
      }, 300)
    );
  }
}
