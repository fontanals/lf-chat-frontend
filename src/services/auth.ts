import {
  RecoverPasswordRequest,
  ResetPasswordRequest,
  SigninRequest,
  SignupRequest,
  VerifyAccountRequest,
} from "../models/requests/auth";
import {
  RecoverPasswordResponse,
  ResetPasswordResponse,
  SigninResponse,
  SignoutResponse,
  SignupResponse,
  VerifyAccountResponse,
} from "../models/responses/auth";
import { IBaseService } from "./base";

export interface IAuthService {
  signup(request: SignupRequest): Promise<SignupResponse>;
  verifyAccount(request: VerifyAccountRequest): Promise<VerifyAccountResponse>;
  signin(request: SigninRequest): Promise<SigninResponse>;
  signout(): Promise<SignoutResponse>;
  recoverPassword(
    request: RecoverPasswordRequest
  ): Promise<RecoverPasswordResponse>;
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}

export class AuthService implements IAuthService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async signup(request: SignupRequest): Promise<SignupResponse> {
    const response = await this.baseService.post<SignupResponse, SignupRequest>(
      { url: "/api/signup", request }
    );

    return response;
  }

  async verifyAccount(
    request: VerifyAccountRequest
  ): Promise<VerifyAccountResponse> {
    const response = await this.baseService.post<
      VerifyAccountResponse,
      VerifyAccountRequest
    >({ url: "/api/verify-account", request });

    return response;
  }

  async signin(request: SigninRequest): Promise<SigninResponse> {
    const response = await this.baseService.post<SigninResponse, SigninRequest>(
      { url: "/api/signin", request }
    );

    return response;
  }

  async signout(): Promise<SignoutResponse> {
    const response = await this.baseService.post<SignoutResponse>({
      url: "/api/signout",
    });

    return response;
  }

  async recoverPassword(
    request: RecoverPasswordRequest
  ): Promise<RecoverPasswordResponse> {
    const response = await this.baseService.post<
      RecoverPasswordResponse,
      RecoverPasswordRequest
    >({ url: "/api/recover-password", request });

    return response;
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await this.baseService.post<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({ url: "/api/reset-password", request });

    return response;
  }
}
