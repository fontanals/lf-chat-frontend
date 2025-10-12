import { create } from "zustand";
import { AssistantMessage, UserContentPart } from "../models/entities/message";

export type PendingMessage = {
  message: UserContentPart[];
  chatId: string;
  projectId?: string | null;
};

export type ChatStore = {
  pendingMessage: PendingMessage | null;
  streamingAnswer: AssistantMessage | null;
  setPendingMessage: (pendingMessage: PendingMessage | null) => void;
  setStreamingAnswer: (streamingAnswer: AssistantMessage | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: null,
  streamingAnswer: null,
  setPendingMessage: (pendingMessage: PendingMessage | null) =>
    set({ pendingMessage }),
  setStreamingAnswer: (streamingAnswer: AssistantMessage | null) =>
    set({ streamingAnswer }),
}));
