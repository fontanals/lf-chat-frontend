import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
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
  TextContentBlock,
  ToolCallContentBlock,
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

export function useAssistantStatus() {
  return useQuery({
    queryKey: ["assistant-status"],
    queryFn: () => services.chat.getAssistantStatus(),
  });
}

export function usePreviousChats() {
  return useQuery({
    queryKey: ["chats", "previous"],
    queryFn: () => services.chat.getChats({ limit: 25 }),
    placeholderData: keepPreviousData,
  });
}

export function useHistoryChats(query?: GetChatsQuery) {
  return useInfiniteQuery({
    queryKey: ["chats", "history", query],
    queryFn: ({ pageParam }) =>
      services.chat.getChats({ ...query, cursor: pageParam }),
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (page) => page.nextCursor,
    placeholderData: keepPreviousData,
  });
}

export function useProjectChats(projectId: string, query?: GetChatsQuery) {
  return useInfiniteQuery({
    queryKey: ["chats", "project", projectId, query],
    queryFn: ({ pageParam }) =>
      services.chat.getChats({ ...query, projectId, cursor: pageParam }),
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (page) => page.nextCursor,
    placeholderData: keepPreviousData,
  });
}

export function useChat(chatId: string, query?: GetChatQuery) {
  return useQuery({
    queryKey: ["chats", chatId],
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const setStreamingMessage = useChatStore(
    (state) => state.setStreamingMessage
  );
  const removeStreamingMessage = useChatStore(
    (state) => state.removeStreamingMessage
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: (args: { request: CreateChatRequest }) => {
      abortControllerRef.current = new AbortController();

      const chat: Chat = {
        id: args.request.id,
        title: t("chat.title.new_chat"),
        projectId: args.request.projectId,
      };

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

      const contentBlocks = new Map<string, AssistantContentBlock>();

      return services.chat.createChat(
        args.request,
        (event) => {
          switch (event.event) {
            case "message-start": {
              assistantMessage.id = event.data.messageId;

              userMessage.childrenMessageIds = [assistantMessage.id];

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "text-start": {
              const contentBlock: TextContentBlock = {
                type: "text",
                id: event.data.id,
                text: "",
              };

              contentBlocks.set(event.data.id, contentBlock);

              assistantMessage.content.push(contentBlock);

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "text-delta": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "text") {
                contentBlock.text += event.data.delta;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call-start": {
              const contentBlock = {
                type: "tool-call",
                id: event.data.id,
                name: event.data.name,
              } as ToolCallContentBlock;

              contentBlocks.set(event.data.id, contentBlock);

              assistantMessage.content.push(contentBlock);

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "tool-call") {
                contentBlock.input = event.data.input;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call-result": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "tool-call") {
                contentBlock.input = event.data.input;
                contentBlock.output = event.data.output;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "message-end": {
              const messageTree: GetChatMessagesResponse = {
                latestPath: [userMessage.id, assistantMessage.id],
                rootMessageIds: [userMessage.id],
                messages: {
                  [userMessage.id]: userMessage,
                  [assistantMessage.id]: assistantMessage,
                },
              };

              queryClient.setQueryData<GetChatMessagesResponse>(
                ["messages", chat.id],
                messageTree
              );

              break;
            }
          }
        },
        abortControllerRef.current.signal
      );
    },
    onSuccess: (_, args) => {
      removeStreamingMessage(args.request.id);

      queryClient.invalidateQueries({ queryKey: ["assistant-status"] });

      queryClient.invalidateQueries({ queryKey: ["chats"] });

      queryClient.invalidateQueries({
        queryKey: ["messages", args.request.id],
      });
    },
  });

  return { ...mutation, onAbort: () => abortControllerRef.current?.abort() };
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  const setStreamingMessage = useChatStore(
    (state) => state.setStreamingMessage
  );
  const removeStreamingMessage = useChatStore(
    (state) => state.removeStreamingMessage
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: (args: {
      params: SendMessageParams;
      request: SendMessageRequest;
    }) => {
      abortControllerRef.current = new AbortController();

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

      queryClient.setQueryData<GetChatMessagesResponse>(
        ["messages", userMessage.chatId],
        (response) => {
          if (response == null) {
            return response;
          }

          const latestPath =
            userMessage.parentMessageId == null
              ? [userMessage.id]
              : response.latestPath
                  .slice(
                    0,
                    response.latestPath.indexOf(userMessage.parentMessageId) + 1
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
              : {}),
            [userMessage.id]: userMessage,
          };

          return { latestPath, rootMessageIds, messages };
        }
      );

      const contentBlocks = new Map<string, AssistantContentBlock>();

      return services.chat.sendMessage(
        args.params,
        args.request,
        (event) => {
          switch (event.event) {
            case "message-start": {
              assistantMessage.id = event.data.messageId;

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "text-start": {
              const contentBlock: TextContentBlock = {
                type: "text",
                id: event.data.id,
                text: "",
              };

              contentBlocks.set(event.data.id, contentBlock);

              assistantMessage.content.push(contentBlock);

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "text-delta": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "text") {
                contentBlock.text += event.data.delta;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call-start": {
              const contentBlock = {
                type: "tool-call",
                id: event.data.id,
                name: event.data.name,
              } as ToolCallContentBlock;

              contentBlocks.set(event.data.id, contentBlock);

              assistantMessage.content.push(contentBlock);

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "tool-call") {
                contentBlock.input = event.data.input;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "tool-call-result": {
              const contentBlock = contentBlocks.get(event.data.id);

              if (contentBlock != null && contentBlock.type === "tool-call") {
                contentBlock.input = event.data.input;
                contentBlock.output = event.data.output;
              }

              setStreamingMessage(assistantMessage.chatId, assistantMessage);

              break;
            }
            case "message-end": {
              userMessage.childrenMessageIds = [assistantMessage.id];

              queryClient.setQueryData<GetChatMessagesResponse>(
                ["messages", userMessage.chatId],
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

                  return {
                    latestPath,
                    rootMessageIds: response.rootMessageIds,
                    messages,
                  };
                }
              );

              break;
            }
          }
        },
        abortControllerRef.current.signal
      );
    },
    onSuccess: (_, args) => {
      removeStreamingMessage(args.params.chatId);

      queryClient.invalidateQueries({ queryKey: ["assistant-status"] });

      queryClient.invalidateQueries({
        queryKey: ["messages", args.params.chatId],
      });
    },
  });

  return { ...mutation, onAbort: () => abortControllerRef.current?.abort() };
}

export function useUpdateChat() {
  const location = useLocation();
  const { chatId, projectId } = useParams();
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
        previousChats?: GetChatsResponse;
        historyChats?: { pages: GetChatsResponse[] };
        projectChats?: { pages: GetChatsResponse[] };
        chat?: GetChatResponse;
      } = {};

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      context.previousChats = queryClient.getQueryData<GetChatsResponse>([
        "chats",
        "previous",
      ]);

      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
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

      if (location.pathname === "/history") {
        context.historyChats = queryClient.getQueryData<{
          pages: GetChatsResponse[];
        }>([
          "chats",
          "history",
          { search, cursor: cursor ?? undefined, limit: 25 },
        ]);

        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "history",
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          (response) => {
            if (response == null) {
              return response;
            }

            const pages = response.pages.map((page) => ({
              ...page,
              items: page.items.map((chat) =>
                chat.id === args.params.chatId
                  ? { ...chat, title: args.request.title }
                  : chat
              ),
            }));

            return { ...response, pages };
          }
        );
      }

      if (/^\/projects\/([^\/]+)$/.test(location.pathname)) {
        context.projectChats = queryClient.getQueryData<{
          pages: GetChatsResponse[];
        }>([
          "chats",
          "project",
          projectId,
          { search, cursor: cursor ?? undefined, limit: 25 },
        ]);

        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "project",
            projectId,
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          (response) => {
            if (response == null) {
              return response;
            }

            const pages = response.pages.map((page) => ({
              ...page,
              items: page.items.map((chat) =>
                chat.id === args.params.chatId
                  ? { ...chat, title: args.request.title }
                  : chat
              ),
            }));

            return { ...response, pages };
          }
        );
      }

      if (
        /^\/chats\/([^\/]+)$/.test(location.pathname) &&
        chatId === args.params.chatId
      ) {
        context.chat = queryClient.getQueryData<GetChatResponse>([
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
        ["chats", "previous"],
        context?.previousChats
      );

      if (location.pathname === "/history") {
        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "history",
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          context?.historyChats
        );
      }

      if (/^\/projects\/([^\/]+)$/.test(location.pathname)) {
        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "project",
            projectId,
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          context?.projectChats
        );
      }

      if (
        /^\/chats\/([^\/]+)$/.test(location.pathname) &&
        chatId === args.params.chatId
      ) {
        queryClient.setQueryData<GetChatResponse>(
          ["chats", chatId],
          context?.chat
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
  const { chatId, projectId } = useParams();
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
        previousChats?: GetChatsResponse;
        historyChats?: { pages: GetChatsResponse[] };
        projectChats?: { pages: GetChatsResponse[] };
      } = {};

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      context.previousChats = queryClient.getQueryData<GetChatsResponse>([
        "chats",
        "previous",
      ]);

      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
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

      if (location.pathname === "/history") {
        context.historyChats = queryClient.getQueryData<{
          pages: GetChatsResponse[];
        }>([
          "chats",
          "history",
          { search, cursor: cursor ?? undefined, limit: 25 },
        ]);

        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "history",
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          (response) => {
            if (response == null) {
              return response;
            }

            const pages = response.pages.map((page) => ({
              ...page,
              items: page.items.filter(
                (chat) => chat.id !== args.params.chatId
              ),
              totalItems: page.totalItems - 1,
            }));

            return { ...response, pages };
          }
        );
      }

      if (/^\/projects\/([^\/]+)$/.test(location.pathname)) {
        context.historyChats = queryClient.getQueryData<{
          pages: GetChatsResponse[];
        }>([
          "chats",
          "project",
          projectId,
          { search, cursor: cursor ?? undefined, limit: 25 },
        ]);

        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "project",
            projectId,
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          (response) => {
            if (response == null) {
              return response;
            }

            const pages = response.pages.map((page) => ({
              ...page,
              items: page.items.filter(
                (chat) => chat.id !== args.params.chatId
              ),
              totalItems: page.totalItems - 1,
            }));

            return { ...response, pages };
          }
        );
      }

      if (
        /^\/chats\/([^\/]+)$/.test(location.pathname) &&
        chatId === args.params.chatId
      ) {
        navigate("/");
      }

      return context;
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
        context?.previousChats
      );

      if (location.pathname === "/history") {
        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "history",
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          context?.historyChats
        );
      }

      if (/^\/projects\/([^\/]+)$/.test(location.pathname)) {
        queryClient.setQueryData<{ pages: GetChatsResponse[] }>(
          [
            "chats",
            "project",
            projectId,
            { search, cursor: cursor ?? undefined, limit: 25 },
          ],
          context?.projectChats
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useDeleteAllChats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => services.chat.deleteAllChats(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<GetChatsResponse>([
        "chats",
        "previous",
      ]);

      queryClient.setQueryData<GetChatsResponse>(["chats", "previous"], () => ({
        items: [],
        totalItems: 0,
      }));

      return { previousChats };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
        context?.previousChats
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
