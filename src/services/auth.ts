import { SigninRequest, SignupRequest } from "../models/requests/auth";
import {
  SigninReponse,
  SignoutResponse,
  SignupResponse,
} from "../models/responses/auth";
import { IBaseService } from "./base";

export interface IAuthService {
  signup(request: SignupRequest): Promise<SignupResponse>;
  signin(request: SigninRequest): Promise<SigninReponse>;
  signout(): Promise<SignoutResponse>;
}

export class AuthService implements IAuthService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async signup(request: SignupRequest): Promise<SignupResponse> {
    const response = await this.baseService.post<SignupResponse, SignupRequest>(
      { url: `/api/signup`, request }
    );

    return response;
  }

  async signin(request: SigninRequest): Promise<SigninReponse> {
    const response = await this.baseService.post<SigninReponse, SigninRequest>({
      url: `/api/signin`,
      request,
    });

    return response;
  }

  async signout(): Promise<SignoutResponse> {
    const response = await this.baseService.post<SignoutResponse>({
      url: `/api/signout`,
    });

    return response;
  }
}
