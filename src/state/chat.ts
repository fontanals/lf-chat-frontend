import { create } from "zustand";
import { AssistantMessage, UserContentBlock } from "../models/entities/message";

type PendingChat = {
  id: string;
  message: UserContentBlock[];
  projectId?: string | null;
};

type ChatStore = {
  pendingChats: Record<string, PendingChat>;
  streamingMessages: Record<string, AssistantMessage>;
  setPendingChat: (chatId: string, chat: PendingChat) => void;
  setStreamingMessage: (chatId: string, message: AssistantMessage) => void;
  removePendingChat: (chatId: string) => void;
  removeStreamingMessage: (chaId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingChats: {},
  streamingMessages: {},
  abortControllers: {},
  setPendingChat: (chatId, chat) =>
    set((state) => ({
      pendingChats: { ...state.pendingChats, [chatId]: chat },
    })),
  setStreamingMessage: (chatId, message) =>
    set((state) => ({
      streamingMessages: {
        ...state.streamingMessages,
        [chatId]: { ...message },
      },
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
