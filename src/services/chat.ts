import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatMessagesParams,
  GetChatParams,
  GetChatQuery,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
  UpdateMessageParams,
  UpdateMessageRequest,
} from "../models/requests/chat";
import {
  DeleteAllChatsResponse,
  DeleteChatResponse,
  GetAssistantStatusResponse,
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
  SendMessageEvent,
  UpdateChatResponse,
  UpdateMessageResponse,
} from "../models/responses/chat";
import { IBaseService } from "./base";

export interface IChatService {
  getAssistantStatus(): Promise<GetAssistantStatusResponse>;
  getChats(query?: GetChatsQuery): Promise<GetChatsResponse>;
  getChat(
    params: GetChatParams,
    query?: GetChatQuery
  ): Promise<GetChatResponse>;
  getChatMessages(
    params: GetChatMessagesParams
  ): Promise<GetChatMessagesResponse>;
  createChat(
    request: CreateChatRequest,
    onEvent: (event: SendMessageEvent) => void,
    abortSignal: AbortSignal
  ): Promise<void>;
  sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: SendMessageEvent) => void,
    abortSignal: AbortSignal
  ): Promise<void>;
  updateChat(
    params: UpdateChatParams,
    request: UpdateChatRequest
  ): Promise<UpdateChatResponse>;
  updateMessage(
    params: UpdateMessageParams,
    request: UpdateMessageRequest
  ): Promise<UpdateMessageResponse>;
  deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse>;
  deleteAllChats(): Promise<DeleteAllChatsResponse>;
}

export class ChatService implements IChatService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async getAssistantStatus(): Promise<GetAssistantStatusResponse> {
    const response = await this.baseService.get<GetAssistantStatusResponse>({
      url: "/api/chats/assistant-status",
    });

    return response;
  }

  async getChats(query?: GetChatsQuery): Promise<GetChatsResponse> {
    const response = await this.baseService.get<
      GetChatsResponse,
      GetChatsQuery
    >({ url: "/api/chats", query });

    return response;
  }

  async getChat(
    params: GetChatParams,
    query?: GetChatQuery
  ): Promise<GetChatResponse> {
    const response = await this.baseService.get<GetChatResponse, GetChatQuery>({
      url: `/api/chats/${params.chatId}`,
      query,
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
    onEvent: (event: SendMessageEvent) => void,
    abortSignal: AbortSignal
  ): Promise<void> {
    await this.baseService.streamPost<SendMessageEvent, CreateChatRequest>({
      url: "/api/chats",
      request,
      onEvent,
      abortSignal,
    });
  }

  async sendMessage(
    params: SendMessageParams,
    request: SendMessageRequest,
    onEvent: (event: SendMessageEvent) => void,
    abortSignal: AbortSignal
  ): Promise<void> {
    await this.baseService.streamPost<SendMessageEvent, SendMessageRequest>({
      url: `/api/chats/${params.chatId}/messages`,
      request,
      onEvent,
      abortSignal,
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

  async updateMessage(
    params: UpdateMessageParams,
    request: UpdateMessageRequest
  ): Promise<UpdateMessageResponse> {
    const response = await this.baseService.patch<
      UpdateMessageResponse,
      UpdateMessageRequest
    >({
      url: `/api/chats/${params.chatId}/messages/${params.messageId}`,
      request,
    });

    return response;
  }

  async deleteChat(params: DeleteChatParams): Promise<DeleteChatResponse> {
    const response = await this.baseService.delete<DeleteChatResponse>({
      url: `/api/chats/${params.chatId}`,
    });

    return response;
  }

  async deleteAllChats(): Promise<DeleteAllChatsResponse> {
    const response = await this.baseService.delete<DeleteAllChatsResponse>({
      url: `/api/chats`,
    });

    return response;
  }
}
