import { create } from "zustand";
import { AssistantMessage, UserContentBlock } from "../models/entities/message";

export type PendingMessage = {
  content: UserContentBlock[];
  chatId: string;
  projectId?: string | null;
};

type ChatStore = {
  pendingMessages: Record<string, PendingMessage>;
  streamingMessages: Record<string, AssistantMessage>;
  setPendingMessage: (chatId: string, message: PendingMessage) => void;
  setStreamingMessage: (chatId: string, message: AssistantMessage) => void;
  removePendingMessage: (chatId: string) => void;
  removeStreamingMessage: (chaId: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessages: {},
  streamingMessages: {},
  setPendingMessage: (chatId, message) =>
    set((state) => ({
      pendingMessages: { ...state.pendingMessages, [chatId]: message },
    })),
  setStreamingMessage: (chatId, message) =>
    set((state) => ({
      streamingMessages: { ...state.streamingMessages, [chatId]: message },
    })),
  removePendingMessage: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.pendingMessages;
      return { pendingMessages: rest };
    }),
  removeStreamingMessage: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...rest } = state.streamingMessages;
      return { streamingMessages: rest };
    }),
}));
