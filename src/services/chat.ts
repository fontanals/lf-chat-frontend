import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatParams,
  GetChatQuery,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
} from "../models/requests/chat";
import {
  ChatServerSentEvent,
  DeleteChatResponse,
  GetChatResponse,
  GetChatsResponse,
  UpdateChatResponse,
} from "../models/responses/chat";
import { IBaseService } from "./base";

export interface IChatService {
  getChats(query?: GetChatsQuery): Promise<GetChatsResponse>;
  getChat(
    params: GetChatParams,
    query?: GetChatQuery
  ): Promise<GetChatResponse>;
  createChat(
    request: CreateChatRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void>;
  sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void>;
  updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse>;
  deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse>;
}

export class ChatService implements IChatService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async getChats(query?: GetChatsQuery): Promise<GetChatsResponse> {
    const response = await this.baseService.get<
      GetChatsResponse,
      GetChatsQuery
    >("/api/chats", query);

    return response;
  }

  async getChat(
    params: GetChatParams,
    query?: GetChatQuery
  ): Promise<GetChatResponse> {
    const response = await this.baseService.get<GetChatResponse, GetChatQuery>(
      `/api/chats/${params.chatId}`,
      query
    );

    return response;
  }

  async createChat(
    request: CreateChatRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: ChatServerSentEvent) => void
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse> {
    const response = await this.baseService.patch<
      UpdateChatResponse,
      UpdateChatRequest
    >(`/api/chats/${params.chatId}`, request);

    return response;
  }

  async deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse> {
    const response = await this.baseService.delete<DeleteChatResponse>(
      `/api/chats/${params.chatId}`
    );

    return response;
  }
}
