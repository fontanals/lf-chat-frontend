import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RefObject } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { v4 as uuid } from "uuid";
import { Chat } from "../models/entities/chat";
import { AssistantMessage, UserMessage } from "../models/entities/message";
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

export function useCreateChat(
  messagesContainerRef?: RefObject<HTMLDivElement | null>
) {
  const queryClient = useQueryClient();

  const setStreamingAnswer = useChatStore((state) => state.setStreamingAnswer);

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
        parentMessageId: userMessage.id,
        chatId: chat.id,
        childrenMessageIds: [],
      };

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

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "text-start": {
            assistantMessage.content.push({ type: "text", text: "" });

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "text-delta": {
            const latestPart =
              assistantMessage.content[assistantMessage.content.length - 1];

            if (latestPart?.type === "text") {
              latestPart.text += event.data.delta;
            }

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "end": {
            setStreamingAnswer(null);

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
          }
        }

        messagesContainerRef?.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
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

export function useSendMessage(
  messagesContainerRef: RefObject<HTMLDivElement | null>
) {
  const queryClient = useQueryClient();

  const setStreamingAnswer = useChatStore((state) => state.setStreamingAnswer);

  return useMutation({
    mutationFn: (args: {
      params: SendMessageParams;
      request: SendMessageRequest;
    }) => {
      const chatId = args.params.chatId;

      const userMessage: UserMessage = {
        id: args.request.id,
        role: "user",
        content: args.request.content,
        parentMessageId: args.request.parentMessageId,
        chatId,
        childrenMessageIds: [],
      };

      const assistantMessage: AssistantMessage = {
        id: "",
        role: "assistant",
        content: [],
        feedback: null,
        parentMessageId: userMessage.id,
        chatId,
        childrenMessageIds: [],
      };

      return services.chat.sendMessage(args.params, args.request, (event) => {
        switch (event.event) {
          case "start": {
            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", args.params.chatId],
              (response) => {
                if (response == null) {
                  return response;
                }

                const latestPath = response.latestPath
                  .slice(
                    0,
                    userMessage.parentMessageId != null
                      ? response.latestPath.indexOf(
                          userMessage.parentMessageId
                        ) + 1
                      : 0
                  )
                  .concat(userMessage.id);

                const rootMessageIds =
                  userMessage.parentMessageId == null
                    ? response.rootMessageIds.concat(userMessage.id)
                    : response.rootMessageIds;

                const messages = {
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
                    : undefined),
                  [userMessage.id]: userMessage,
                };

                return { latestPath, rootMessageIds, messages };
              }
            );

            break;
          }
          case "message-start": {
            assistantMessage.id = event.data.messageId;

            userMessage.childrenMessageIds = [assistantMessage.id];

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "text-start": {
            assistantMessage.content.push({ type: "text", text: "" });

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "text-delta": {
            const latestPart =
              assistantMessage.content[assistantMessage.content.length - 1];

            if (latestPart?.type === "text") {
              latestPart.text += event.data.delta;
            }

            setStreamingAnswer(assistantMessage);

            break;
          }
          case "end": {
            setStreamingAnswer(null);

            queryClient.setQueryData<GetChatMessagesResponse>(
              ["messages", chatId],
              (response) => {
                if (response == null) {
                  return response;
                }

                const latestPath = response.latestPath.concat(
                  assistantMessage.id
                );

                const messages = {
                  ...response.messages,
                  [userMessage.id]: userMessage,
                  [assistantMessage.id]: assistantMessage,
                };

                return { ...response, latestPath, messages };
              }
            );
          }
        }

        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
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

        const chats = response.chats?.map((chat) =>
          chat.id === args.params.chatId
            ? { ...chat, title: args.request.title }
            : chat
        );

        return { ...response, chats };
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

            const chats = response.chats?.map((chat) =>
              chat.id === args.params.chatId
                ? { ...chat, title: args.request.title }
                : chat
            );

            return { ...response, chats };
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

        const chats = response.chats?.filter(
          (chat) => chat.id !== args.params.chatId
        );

        return { ...response, chats };
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

            const chats = response.chats?.filter(
              (chat) => chat.id !== args.params.chatId
            );

            return { ...response, chats };
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
