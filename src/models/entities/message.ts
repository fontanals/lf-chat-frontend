export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  parentId?: string | null;
  chatId: string;
  createdAt?: Date;
  childrenIds?: string[];
  isIncomplete?: boolean;
};
