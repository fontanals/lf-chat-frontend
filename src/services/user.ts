import { UpdateUserRequest } from "../models/requests/user";
import {
  DeleteUserResponse,
  GetUserResponse,
  UpdateUserResponse,
} from "../models/responses/user";
import { IBaseService } from "./base";

export interface IUserService {
  getUser(): Promise<GetUserResponse>;
  updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse>;
  deleteUser(): Promise<DeleteUserResponse>;
}

export class UserService implements IUserService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async getUser(): Promise<GetUserResponse> {
    const response = await this.baseService.get<GetUserResponse>({
      url: `/api/user`,
    });

    return response;
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const response = await this.baseService.patch<
      UpdateUserResponse,
      UpdateUserRequest
    >({ url: `/api/user`, request });

    return response;
  }

  async deleteUser(): Promise<DeleteUserResponse> {
    const response = await this.baseService.delete<DeleteUserResponse>({
      url: `/api/user`,
    });

    return response;
  }
}
