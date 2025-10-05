export type GetChatsQuery = {
  search?: string;
  projectId?: string;
  cursor?: Date;
  limit?: number;
};

export type GetChatParams = { chatId: string };

export type GetChatMessagesParams = { chatId: string };

export type CreateChatRequest = {
  id: string;
  message: string;
  projectId?: string | null;
};

export type SendMessageParams = { chatId: string };

export type SendMessageRequest = {
  id: string;
  content: string;
  parentId?: string | null;
};

export type UpdateChatParams = { chatId: string };

export type UpdateChatRequest = { title: string };

export type DeleteChatParams = { chatId: string };
