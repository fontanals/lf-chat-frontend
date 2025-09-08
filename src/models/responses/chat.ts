import { ServerSentEvent } from "../../utils/types";
import { Chat } from "../entities/chat";

export type GetChatsResponse = Chat[];

export type GetChatResponse = Chat;

export type ChatServerSentEvent =
  | ServerSentEvent<"start", { messageId: string }>
  | ServerSentEvent<"delta", { messageId: string; delta: string }>
  | ServerSentEvent<"end", { messageId: string }>;

export type UpdateChatResponse = string;

export type DeleteChatResponse = string;
