export type MessageRole = "user" | "assistant";

export type MessageFeedback = "like" | "dislike";

export type TextPart = { type: "text"; text: string };

export type DocumentPart = {
  type: "document";
  id: string;
  name: string;
  mimetype: string;
};

export type UserContentPart = TextPart | DocumentPart;

export type AssistantContentPart = TextPart;

export type UserMessage = {
  id: string;
  role: "user";
  content: UserContentPart[];
  parentMessageId?: string | null;
  chatId: string;
  createdAt?: Date;
  updatedAt?: Date;
  childrenMessageIds?: string[];
};

export type AssistantMessage = {
  id: string;
  role: "assistant";
  content: AssistantContentPart[];
  feedback?: MessageFeedback | null;
  parentMessageId?: string | null;
  chatId: string;
  createdAt?: Date;
  updatedAt?: Date;
  childrenMessageIds?: string[];
};

export type Message = UserMessage | AssistantMessage;
