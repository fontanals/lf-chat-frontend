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
import {
  CreateChatRequest,
  DeleteChatParams,
  GetChatsQuery,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
} from "../models/requests/chat";
import {
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
} from "../models/responses/chat";
import { services } from "../services/provider";
import { SearchParamsUtils } from "../utils/search-params";

export function useChats(query?: GetChatsQuery) {
  return useQuery({
    queryKey: query != null ? ["chats", query] : ["chats"],
    queryFn: () => services.chat.getChats(query),
    placeholderData: keepPreviousData,
  });
}

export function useChat(chatId: string) {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: () => services.chat.getChat({ chatId }),
  });
}

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => services.chat.getChatMessages({ chatId }),
  });
}

export function useCreateChat(
  messagesContainerRef: RefObject<HTMLDivElement | null>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { request: CreateChatRequest }) =>
      services.chat.createChat(args.request, (event) => {
        if (event.event === "start") {
          const userMessageId = uuid();

          queryClient.setQueryData<GetChatResponse>(
            ["chats", args.request.id],
            () => ({ id: args.request.id, title: "" })
          );

          queryClient.setQueryData<GetChatMessagesResponse>(
            ["messages", args.request.id],
            () => ({
              latestPath: [userMessageId, event.data.messageId],
              rootMessageIds: [userMessageId],
              messages: {
                [userMessageId]: {
                  id: userMessageId,
                  role: "user",
                  content: args.request.message,
                  parentId: null,
                  chatId: args.request.id,
                  childrenIds: [event.data.messageId],
                },
                [event.data.messageId]: {
                  id: event.data.messageId,
                  role: "assistant",
                  content: "",
                  parentId: userMessageId,
                  chatId: args.request.id,
                  isIncomplete: true,
                  childrenIds: [],
                },
              },
            })
          );
        } else if (event.event === "delta") {
          queryClient.setQueryData<GetChatMessagesResponse>(
            ["messages", args.request.id],
            (response) =>
              response != null
                ? {
                    ...response,
                    messages: {
                      ...response.messages,
                      [event.data.messageId]: {
                        ...response.messages[event.data.messageId],
                        content:
                          response.messages[event.data.messageId].content +
                          event.data.delta,
                      },
                    },
                  }
                : response
          );

          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }),
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", args.request.id],
      });

      navigate(`/chat/${args.request.id}`);
    },
  });
}

export function useSendMessage(
  messagesContainerRef: RefObject<HTMLDivElement | null>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      params: SendMessageParams;
      request: SendMessageRequest;
    }) =>
      services.chat.sendMessage(args.params, args.request, (event) => {
        if (event.event === "start") {
          queryClient.setQueryData<GetChatMessagesResponse>(
            ["messages", args.params.chatId],
            (response) =>
              response != null
                ? {
                    latestPath: response.latestPath
                      .slice(
                        0,
                        args.request.parentId != null
                          ? response.latestPath.indexOf(args.request.parentId) +
                              1
                          : 0
                      )
                      .concat([args.request.id, event.data.messageId]),
                    rootMessageIds:
                      args.request.parentId == null
                        ? response.rootMessageIds.concat(args.request.id)
                        : response.rootMessageIds,
                    messages: {
                      ...response.messages,
                      ...(args.request.parentId != null
                        ? {
                            [args.request.parentId]: {
                              ...response.messages[args.request.parentId],
                              childrenIds: response.messages[
                                args.request.parentId
                              ].childrenIds?.concat(args.request.id),
                            },
                          }
                        : undefined),
                      [args.request.id]: {
                        id: args.request.id,
                        role: "user",
                        content: args.request.content,
                        parentId: args.request.parentId,
                        chatId: args.params.chatId,
                        childrenIds: [event.data.messageId],
                      },
                      [event.data.messageId]: {
                        id: event.data.messageId,
                        role: "assistant",
                        content: "",
                        parentId: args.request.id,
                        chatId: args.params.chatId,
                        childrenIds: [],
                        isIncomplete: true,
                      },
                    },
                  }
                : response
          );
        } else if (event.event === "delta") {
          queryClient.setQueryData<GetChatMessagesResponse>(
            ["messages", args.params.chatId],
            (response) =>
              response != null
                ? {
                    ...response,
                    messages: {
                      ...response.messages,
                      [event.data.messageId]: {
                        ...response.messages[event.data.messageId],
                        content:
                          response.messages[event.data.messageId].content +
                          event.data.delta,
                      },
                    },
                  }
                : response
          );

          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }),
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

      queryClient.setQueryData<GetChatsResponse>(["chats"], (response) =>
        response != null
          ? {
              ...response,
              chats: response.chats?.map((chat) =>
                chat.id === args.params.chatId
                  ? { ...chat, title: args.request.title }
                  : chat
              ),
            }
          : response
      );

      if (location.pathname === "/history") {
        context.historyPreviousChats =
          queryClient.getQueryData<GetChatsResponse>([
            "chats",
            { search, cursor: cursor ?? undefined, limit: 20 },
          ]);

        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          (response) =>
            response != null
              ? {
                  ...response,
                  chats: response.chats?.map((chat) =>
                    chat.id === args.params.chatId
                      ? { ...chat, title: args.request.title }
                      : chat
                  ),
                }
              : response
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
          (chat) =>
            chat != null ? { ...chat, title: args.request.title } : chat
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

      queryClient.setQueryData<GetChatsResponse>(["chats"], (response) =>
        response != null
          ? {
              ...response,
              chats: response.chats?.filter(
                (chat) => chat.id !== args.params.chatId
              ),
            }
          : response
      );

      if (location.pathname === "/history") {
        context.historyPreviousChats =
          queryClient.getQueryData<GetChatsResponse>([
            "chats",
            { search, cursor: cursor ?? undefined, limit: 20 },
          ]);

        queryClient.setQueryData<GetChatsResponse>(
          ["chats", { search, cursor: cursor ?? undefined, limit: 20 }],
          (response) =>
            response != null
              ? {
                  ...response,
                  chats: response.chats?.filter(
                    (chat) => chat.id !== args.params.chatId
                  ),
                }
              : response
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
