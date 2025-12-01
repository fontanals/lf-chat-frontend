import { MessageFeedback, UserContentBlock } from "../entities/message";

export type GetChatsQuery = {
  search?: string;
  projectId?: string;
  cursor?: string;
  limit?: number;
};

export type GetChatParams = { chatId: string };

export type GetChatQuery = { expand?: string[] };

export type GetChatMessagesParams = { chatId: string };

export type GetChatMessagesQuery = { expand?: string[] };

export type CreateChatRequest = {
  id: string;
  message: UserContentBlock[];
  projectId?: string | null;
};

export type SendMessageParams = { chatId: string };

export type SendMessageRequest = {
  id: string;
  content: UserContentBlock[];
  parentMessageId?: string | null;
};

export type UpdateChatParams = { chatId: string };

export type UpdateMessageParams = { chatId: string; messageId: string };

export type UpdateMessageRequest = { feedback?: MessageFeedback | null };

export type UpdateChatRequest = { title: string };

export type DeleteChatParams = { chatId: string };
