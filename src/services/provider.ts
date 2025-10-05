import { config } from "../config";
import { HttpClient, IHttpClient } from "../utils/http-client";
import { AuthService, IAuthService } from "./auth";
import { BaseService, IBaseService } from "./base";
import { ChatService, IChatService } from "./chat";
import { DocumentService, IDocumentService } from "./document";
import { MockAuthService } from "./mock/auth";
import { MockChatService } from "./mock/chat";
import { MockDocumentService } from "./mock/document";
import { MockProjectService } from "./mock/project";
import { MockUserService } from "./mock/user";
import { IProjectService, ProjectService } from "./project";
import { IUserService, UserService } from "./user";

export class Services {
  readonly httpClient: IHttpClient;
  readonly base: IBaseService;
  readonly auth: IAuthService;
  readonly user: IUserService;
  readonly project: IProjectService;
  readonly chat: IChatService;
  readonly document: IDocumentService;

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

    this.project =
      serviceType === "mock"
        ? new MockProjectService()
        : new ProjectService(this.base);

    this.chat =
      serviceType === "mock"
        ? new MockChatService()
        : new ChatService(this.base);

    this.document =
      serviceType === "mock"
        ? new MockDocumentService()
        : new DocumentService(this.base);
  }
}

export const services = new Services(config.VITE_SERVICE_TYPE);
