import { create } from "zustand";
import { AssistantMessage, UserContentBlock } from "../models/entities/message";
import { Chat } from "../models/entities/chat";

export type PendingChat = {
  chat: Chat;
  message: UserContentBlock[];
};

type ChatStore = {
  pendingChats: Record<string, PendingChat>;
  streamingMessages: Record<string, AssistantMessage>;
  setPendingChat: (chatId: string, message: PendingChat) => void;
  setStreamingMessage: (chatId: string, message: AssistantMessage) => void;
  removePendingChat: (chatId: string) => void;
  removeStreamingMessage: (chaId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingChats: {},
  streamingMessages: {},
  setPendingChat: (chatId, message) =>
    set((state) => ({
      pendingChats: { ...state.pendingChats, [chatId]: message },
    })),
  setStreamingMessage: (chatId, message) =>
    set((state) => ({
      streamingMessages: { ...state.streamingMessages, [chatId]: message },
    })),
  removePendingChat: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.pendingChats;
      return { pendingChats: rest };
    }),
  removeStreamingMessage: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.streamingMessages;
      return { streamingMessages: rest };
    }),
}));
