import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatMessagesParams,
  GetChatParams,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
} from "../models/requests/chat";
import {
  SendMessageEvent,
  DeleteChatResponse,
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
  UpdateChatResponse,
} from "../models/responses/chat";
import { IBaseService } from "./base";

export interface IChatService {
  getChats(query?: GetChatsQuery): Promise<GetChatsResponse>;
  getChat(params: GetChatParams): Promise<GetChatResponse>;
  getChatMessages(
    params: GetChatMessagesParams
  ): Promise<GetChatMessagesResponse>;
  createChat(
    request: CreateChatRequest,
    onEvent: (event: SendMessageEvent) => void
  ): Promise<void>;
  sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: SendMessageEvent) => void
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
    >({ url: "/api/chats", query });

    return response;
  }

  async getChat(params: GetChatParams): Promise<GetChatResponse> {
    const response = await this.baseService.get<GetChatResponse>({
      url: `/api/chats/${params.chatId}`,
    });

    return response;
  }

  async getChatMessages(
    params: GetChatMessagesParams
  ): Promise<GetChatMessagesResponse> {
    const response = await this.baseService.get<GetChatMessagesResponse>({
      url: `/api/chats/${params.chatId}/messages`,
    });

    return response;
  }

  async createChat(
    request: CreateChatRequest,
    onEvent: (event: SendMessageEvent) => void
  ): Promise<void> {
    await this.baseService.streamPost<SendMessageEvent, CreateChatRequest>({
      url: "/api/chats",
      request,
      onEvent,
    });
  }

  async sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: SendMessageEvent) => void
  ): Promise<void> {
    await this.baseService.streamPost<SendMessageEvent, SendMessageRequest>({
      url: `/api/chats/${params.chatId}/messages`,
      request,
      onEvent,
    });
  }

  async updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse> {
    const response = await this.baseService.patch<
      UpdateChatResponse,
      UpdateChatRequest
    >({ url: `/api/chats/${params.chatId}`, request });

    return response;
  }

  async deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse> {
    const response = await this.baseService.delete<DeleteChatResponse>({
      url: `/api/chats/${params.chatId}`,
    });

    return response;
  }
}
