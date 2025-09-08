import { SigninRequest, SignupRequest } from "../models/requests/auth";
import { SigninReponse, SignupResponse } from "../models/responses/auth";
import { IBaseService } from "./base";

export interface IAuthService {
  signup(request: SignupRequest): Promise<SignupResponse>;
  signin(request: SigninRequest): Promise<SigninReponse>;
}

export class AuthService implements IAuthService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async signup(request: SignupRequest): Promise<SignupResponse> {
    const response = await this.baseService.post<SignupResponse, SignupRequest>(
      `/api/signup`,
      request
    );

    return response;
  }

  async signin(request: SigninRequest): Promise<SigninReponse> {
    const response = await this.baseService.post<SigninReponse, SigninRequest>(
      `/api/signin`,
      request
    );

    return response;
  }
}
