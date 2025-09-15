import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { GetChatResponse, GetChatsResponse } from "../models/responses/chat";
import { services } from "../services/provider";
import { SearchParamsUtils } from "../utils/search-params";

export function useChats(query?: GetChatsQuery) {
  return useQuery({
    queryKey: query != null ? ["chats", query] : ["chats"],
    queryFn: () => services.chat.getChats(query),
  });
}

export function useChat(chatId: string) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => services.chat.getChat({ chatId }, { expand: ["messages"] }),
    select: (response) => response.chat,
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
          queryClient.setQueryData<GetChatResponse>(
            ["chat", args.request.id],
            () => ({
              chat: {
                id: args.request.id,
                title: "",
                messages: [
                  {
                    id: uuid(),
                    role: "user",
                    content: args.request.message,
                    chatId: args.request.id,
                  },
                  {
                    id: event.data.messageId,
                    role: "assistant",
                    content: "",
                    chatId: args.request.id,
                  },
                ],
              },
            })
          );
        } else if (event.event === "delta") {
          queryClient.setQueryData<GetChatResponse>(
            ["chat", args.request.id],
            (response) =>
              response != null
                ? {
                    chat: {
                      ...response.chat,
                      messages: response.chat.messages?.map((message) =>
                        message.id === event.data.messageId
                          ? {
                              ...message,
                              content: message.content + event.data.delta,
                            }
                          : message
                      ),
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
      queryClient.invalidateQueries({ queryKey: ["chat", args.request.id] });

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
          queryClient.setQueryData<GetChatResponse>(
            ["chat", args.params.chatId],
            (response) =>
              response != null
                ? {
                    chat: {
                      ...response.chat,
                      messages: response.chat.messages?.concat(
                        {
                          id: args.request.id,
                          role: "user",
                          content: args.request.content,
                          chatId: args.params.chatId,
                        },
                        {
                          id: event.data.messageId,
                          role: "assistant",
                          content: "",
                          chatId: args.params.chatId,
                        }
                      ),
                    },
                  }
                : response
          );
        } else if (event.event === "delta") {
          queryClient.setQueryData<GetChatResponse>(
            ["chat", args.params.chatId],
            (response) =>
              response != null
                ? {
                    chat: {
                      ...response.chat,
                      messages: response.chat.messages?.map((message) =>
                        message.id === event.data.messageId
                          ? {
                              ...message,
                              content: message.content + event.data.delta,
                            }
                          : message
                      ),
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
      queryClient.invalidateQueries({ queryKey: ["chat", args.params.chatId] });
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
          "chat",
          args.params.chatId,
        ]);

        queryClient.setQueryData<GetChatResponse>(
          ["chat", args.params.chatId],
          (response) =>
            response != null
              ? {
                  ...response,
                  chat: { ...response.chat, title: args.request.title },
                }
              : response
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
          ["chat", chatId],
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
