import { HttpClient, IHttpClient } from "../utils/http-client";
import { AuthService, IAuthService } from "./auth";
import { BaseService, IBaseService } from "./base";
import { ChatService, IChatService } from "./chat";
import { MockAuthService } from "./mock/auth";
import { MockChatService } from "./mock/chat";
import { MockUserService } from "./mock/user";
import { IUserService, UserService } from "./user";

export class Services {
  readonly httpClient: IHttpClient;
  readonly base: IBaseService;
  readonly auth: IAuthService;
  readonly user: IUserService;
  readonly chat: IChatService;

  constructor(serviceType: "mock" | "web" = "web") {
    this.httpClient = new HttpClient();
    this.base = new BaseService(this.httpClient);

    this.auth =
      serviceType === "mock"
        ? new MockAuthService()
        : new AuthService(this.base);

    this.user =
      serviceType === "mock"
        ? new MockUserService()
        : new UserService(this.base);

    this.chat =
      serviceType === "mock"
        ? new MockChatService()
        : new ChatService(this.base);
  }
}

export const services = new Services("mock");
