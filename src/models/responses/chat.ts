import { ServerSentEvent } from "../../utils/types";
import { Chat } from "../entities/chat";
import { Message } from "../entities/message";

export type TextPartStart = { type: "text-start"; messageId: string };

export type TextPartDelta = {
  type: "text-delta";
  messageId: string;
  delta: string;
};

export type TextPartEnd = { type: "text-end"; messageId: string };

export type MessageStart = { type: "message-start"; messageId: string };

export type MessageEnd = { type: "message-end"; messageId: string };

export type TextPartStartEvent = ServerSentEvent<"text-start", TextPartStart>;

export type TextPartDeltaEvent = ServerSentEvent<"text-delta", TextPartDelta>;

export type TextPartEndEvent = ServerSentEvent<"text-end", TextPartEnd>;

export type MessageStartEvent = ServerSentEvent<"message-start", MessageStart>;

export type MessageEndEvent = ServerSentEvent<"message-end", MessageEnd>;

export type SendMessageEvent =
  | TextPartStartEvent
  | TextPartDeltaEvent
  | TextPartEndEvent
  | MessageStartEvent
  | MessageEndEvent;

export type GetChatsResponse = { chats: Chat[]; totalChats: number };

export type GetChatResponse = Chat;

export type GetChatMessagesResponse = {
  latestPath: string[];
  rootMessageIds: string[];
  messages: Record<string, Message>;
};

export type UpdateChatResponse = string;

export type UdpateMessageResponse = string;

export type DeleteChatResponse = string;
