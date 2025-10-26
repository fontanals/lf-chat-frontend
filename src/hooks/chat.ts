import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { v4 as uuid } from "uuid";
import { Chat } from "../models/entities/chat";
import {
  AssistantContentBlock,
  AssistantMessage,
  UserMessage,
} from "../models/entities/message";
import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatQuery,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
  UpdateMessageParams,
  UpdateMessageRequest,
} from "../models/requests/chat";
import {
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
} from "../models/responses/chat";
import { services } from "../services/provider";
import { useChatStore } from "../state/chat";
import { SearchParamsUtils } from "../utils/search-params";

export function useChats(query?: GetChatsQuery) {
  return useQuery({
    queryKey: query != null ? ["chats", query] : ["chats"],
    queryFn: () => services.chat.getChats(query),
    placeholderData: keepPreviousData,
  });
}

export function useChat(chatId: string, query?: GetChatQuery) {
  return useQuery({
    queryKey: query != null ? ["chats", chatId, query] : ["chats", chatId],
    queryFn: () => services.chat.getChat({ chatId }, query),
  });
}

export function useChatMessages(chatId: string, enabled = true) {
  return useQuery({
    enabled,
    queryKey: ["messages", chatId],
    queryFn: async () => services.chat.getChatMessages({ chatId }),
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  const setStreamingMessage = useChatStore(
    (state) => state.setStreamingMessage
  );
  const removeStreamingMessage = useChatStore(
    (state) => state.removeStreamingMessage
  );

  return useMutation({
    mutationFn: (args: { request: CreateChatRequest }) => {
      const chat: Chat = { id: args.request.id, title: "" };

      const userMessage: UserMessage = {
        id: uuid(),
        role: "user",
        content: args.request.message,
        parentMessageId: null,
        chatId: chat.id,
        childrenMessageIds: [],
      };

      const assistantMessage: AssistantMessage = {
        id: "",
        role: "assistant",
        content: [],
        feedback: null,
        finishReason: "stop",
        parentMessageId: userMessage.id,
        chatId: chat.id,
        childrenMessageIds: [],
      };

      let currentContentBlock: AssistantContentBlock | null = null;

      return services.chat.createChat(args.request, (event) => {
        switch (event.event) {
          case "start": {
            queryClient.setQueryData<GetChatResponse>(["chats", chat.id], chat);

            const messageTree: GetChatMessagesResponse = {
              latestPath: [userMessage.id],
              rootMessageIds: [userMessage.id],
              messages: { [userMessage.id]: userMessage },
            };

            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", chat.id],
              messageTree
            );

            break;
          }
          case "message-start": {
            assistantMessage.id = event.data.messageId;

            userMessage.childrenMessageIds = [assistantMessage.id];

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "text-start": {
            currentContentBlock = { type: "text", text: "" };

            assistantMessage.content.push(currentContentBlock);

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "text-delta": {
            if (currentContentBlock?.type === "text") {
              currentContentBlock.text += event.data.delta;
            }

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "end": {
            removeStreamingMessage(assistantMessage.chatId);

            const messageTree: GetChatMessagesResponse = {
              latestPath: [userMessage.id, assistantMessage.id],
              rootMessageIds: [userMessage.id],
              messages: {
                [userMessage.id]: userMessage,
                [assistantMessage.id]: assistantMessage,
              },
            };

            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", args.request.id],
              messageTree
            );

            break;
          }
        }
      });
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      queryClient.invalidateQueries({
        queryKey: ["messages", args.request.id],
      });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const setStreamingMessage = useChatStore(
    (state) => state.setStreamingMessage
  );
  const removeStreamingMessage = useChatStore(
    (state) => state.removeStreamingMessage
  );

  return useMutation({
    mutationFn: (args: {
      params: SendMessageParams;
      request: SendMessageRequest;
    }) => {
      const userMessage: UserMessage = {
        id: args.request.id,
        role: "user",
        content: args.request.content,
        parentMessageId: args.request.parentMessageId,
        chatId: args.params.chatId,
        childrenMessageIds: [],
      };

      const assistantMessage: AssistantMessage = {
        id: "",
        role: "assistant",
        content: [],
        feedback: null,
        finishReason: "stop",
        parentMessageId: userMessage.id,
        chatId: userMessage.chatId,
        childrenMessageIds: [],
      };

      let currentContentBlock: AssistantContentBlock | null = null;

      return services.chat.sendMessage(args.params, args.request, (event) => {
        switch (event.event) {
          case "start": {
            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", userMessage.chatId],
              (response) => {
                if (response == null) {
                  return response;
                }

                return {
                  latestPath:
                    userMessage.parentMessageId == null
                      ? [userMessage.id]
                      : response.latestPath.concat(userMessage.id),
                  rootMessageIds:
                    userMessage.parentMessageId == null
                      ? response.rootMessageIds.concat(userMessage.id)
                      : response.rootMessageIds,
                  messages: {
                    ...response.messages,
                    ...(userMessage.parentMessageId != null
                      ? {
                          [userMessage.parentMessageId]: {
                            ...response.messages[userMessage.parentMessageId],
                            childrenMessageIds: response.messages[
                              userMessage.parentMessageId
                            ].childrenMessageIds?.concat(userMessage.id),
                          },
                        }
                      : {}),
                    [userMessage.id]: userMessage,
                  },
                };
              }
            );

            break;
          }
          case "message-start": {
            assistantMessage.id = event.data.messageId;

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "text-start": {
            currentContentBlock = { type: "text", text: "" };

            assistantMessage.content.push(currentContentBlock);

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "text-delta": {
            if (currentContentBlock?.type === "text") {
              currentContentBlock.text += event.data.delta;
            }

            setStreamingMessage(assistantMessage.chatId, assistantMessage);

            break;
          }
          case "message-end": {
            userMessage.childrenMessageIds = [assistantMessage.id];

            removeStreamingMessage(assistantMessage.chatId);

            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", userMessage.chatId],
              (response) => {
                if (response == null) {
                  return response;
                }

                return {
                  latestPath: response.latestPath.concat(assistantMessage.id),
                  rootMessageIds: response.rootMessageIds,
                  messages: {
                    ...response.messages,
                    [userMessage.id]: userMessage,
                    [assistantMessage.id]: assistantMessage,
                  },
                };
              }
            );

            break;
          }
        }
      });
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", args.params.chatId],
      });
    },
  });
}

export function useUpdateChat() {
  const location = useLocation();
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") ?? "";
  const cursor = SearchParamsUtils.getDate(searchParams, "cursor");

  return useMutation({
    mutationFn: (args: {
      params: UpdateChatParams;
      request: UpdateChatRequest;
    }) => services.chat.updateChat(args.params, args.request),
    onMutate: async (args) => {
      const context: {
        sidebarPreviousChats?: GetChatsResponse;
        historyPreviousChats?: GetChatsResponse;
        chatPreviousChat?: GetChatResponse;
      } = {};

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      context.sidebarPreviousChats = queryClient.getQueryData<GetChatsResponse>(
        ["chats"]
      );

      queryClient.setQueryData<GetChatsResponse>(["chats"], (response) => {
        if (response == null) {
          return response;
        }

        const items = response.items.map((chat) =>
          chat.id === args.params.chatId
            ? { ...chat, title: args.request.title }
            : chat
        );

        return { ...response, items };
      });

      if (location.pathname === "/history") {
        context.historyPreviousChats =
          queryClient.getQueryData<GetChatsResponse>([
            "chats",
            { search, cursor: cursor ?? undefined, limit: 20 },
          ]);

        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          (response) => {
            if (response == null) {
              return response;
            }

            const items = response.items.map((chat) =>
              chat.id === args.params.chatId
                ? { ...chat, title: args.request.title }
                : chat
            );

            return { ...response, items };
          }
        );
      }

      if (
        location.pathname.startsWith("/chat") &&
        chatId === args.params.chatId
      ) {
        context.chatPreviousChat = queryClient.getQueryData<GetChatResponse>([
          "chats",
          args.params.chatId,
        ]);

        queryClient.setQueryData<GetChatResponse>(
          ["chats", args.params.chatId],
          (chat) => {
            if (chat == null) {
              return chat;
            }

            return { ...chat, title: args.request.title };
          }
        );
      }

      return context;
    },
    onError: (_, args, context) => {
      queryClient.setQueryData<GetChatsResponse>(
        ["chats"],
        context?.sidebarPreviousChats
      );

      if (location.pathname === "/history") {
        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          context?.historyPreviousChats
        );
      }

      if (
        location.pathname.startsWith("/chat") &&
        chatId === args.params.chatId
      ) {
        queryClient.setQueryData<GetChatResponse>(
          ["chats", chatId],
          context?.chatPreviousChat
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      params: UpdateMessageParams;
      request: UpdateMessageRequest;
    }) => services.chat.updateMessage(args.params, args.request),
    onMutate: async (args) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", args.params.chatId],
      });

      const previousMessages =
        queryClient.getQueryData<GetChatMessagesResponse>([
          "messages",
          args.params.chatId,
        ]);

      queryClient.setQueryData<GetChatMessagesResponse>(
        ["messages", args.params.chatId],
        (response) => {
          if (response == null) {
            return response;
          }

          const messages = {
            ...response.messages,
            [args.params.messageId]: {
              ...response.messages[args.params.messageId],
              feedback: args.request.feedback,
            },
          };

          return { ...response, messages };
        }
      );

      return { previousMessages };
    },
    onError: (_, args, context) => {
      queryClient.setQueryData<GetChatMessagesResponse>(
        ["messages", args.params.chatId],
        context?.previousMessages
      );
    },
    onSettled: (_, __, args) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", args.params.chatId],
      });
    },
  });
}

export function useDeleteChat() {
  const location = useLocation();
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") ?? "";
  const cursor = SearchParamsUtils.getDate(searchParams, "cursor");

  return useMutation({
    mutationFn: (args: { params: DeleteChatParams }) =>
      services.chat.deleteChat(args.params),
    onMutate: async (args) => {
      const context: {
        sidebarPreviousChats?: GetChatsResponse;
        historyPreviousChats?: GetChatsResponse;
        chatPreviousChat?: GetChatResponse;
      } = {};

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      context.sidebarPreviousChats = queryClient.getQueryData<GetChatsResponse>(
        ["chats"]
      );

      queryClient.setQueryData<GetChatsResponse>(["chats"], (response) => {
        if (response == null) {
          return response;
        }

        const items = response.items.filter(
          (chat) => chat.id !== args.params.chatId
        );

        const totalItems = response.totalItems - 1;

        return { ...response, items, totalItems };
      });

      if (location.pathname === "/history") {
        context.historyPreviousChats =
          queryClient.getQueryData<GetChatsResponse>([
            "chats",
            { search, cursor: cursor ?? undefined, limit: 20 },
          ]);

        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          (response) => {
            if (response == null) {
              return response;
            }

            const items = response.items.filter(
              (chat) => chat.id !== args.params.chatId
            );

            const totalItems = response.totalItems - 1;

            return { ...response, items, totalItems };
          }
        );
      }

      if (
        location.pathname.startsWith("/chat") &&
        chatId === args.params.chatId
      ) {
        navigate("/");
      }

      return context;
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<GetChatsResponse>(
        ["chats"],
        context?.sidebarPreviousChats
      );

      if (location.pathname === "/history") {
        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          context?.historyPreviousChats
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
