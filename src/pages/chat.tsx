import { Box, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { AssistantMessage, UserMessage } from "../components/chat/message";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { Chat } from "../models/entities/chat";
import {
  CreateChatRequest,
  DeleteChatParams,
  SendMessageParams,
  SendMessageRequest,
  UpdateChatParams,
  UpdateChatRequest,
} from "../models/requests/chat";
import { services } from "../services/provider";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { chatId: paramsChatId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [chatId, setChatId] = useState(paramsChatId ?? uuid());
  const [message, setMessage] = useState("");
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => services.chat.getChat({ chatId }, { expand: ["messages"] }),
  });

  const { mutate: createChat } = useMutation({
    mutationFn: (args: { request: CreateChatRequest }) =>
      services.chat.createChat(args.request, (event) => {
        if (event.event === "start") {
          queryClient.setQueryData<Chat>(["chat", args.request.id], () => ({
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
          }));
        } else if (event.event === "delta") {
          queryClient.setQueryData<Chat>(["chat", args.request.id], (chat) =>
            chat != null
              ? {
                  ...chat,
                  messages: chat.messages?.map((message) =>
                    message.id === event.data.messageId
                      ? {
                          ...message,
                          content: message.content + event.data.delta,
                        }
                      : message
                  ),
                }
              : chat
          );

          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }),
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      navigate(`/chat/${args.request.id}`);
    },
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: (args: {
      params: SendMessageParams;
      request: SendMessageRequest;
    }) =>
      services.chat.sendMessage(args.params, args.request, (event) => {
        if (event.event === "start") {
          queryClient.setQueryData<Chat>(["chat", args.params.chatId], (chat) =>
            chat != null
              ? {
                  ...chat,
                  messages: chat.messages?.concat(
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
                }
              : chat
          );
        } else if (event.event === "delta") {
          queryClient.setQueryData<Chat>(["chat", args.params.chatId], (chat) =>
            chat != null
              ? {
                  ...chat,
                  messages: chat.messages?.map((message) =>
                    message.id === event.data.messageId
                      ? {
                          ...message,
                          content: message.content + event.data.delta,
                        }
                      : message
                  ),
                }
              : chat
          );

          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }),
  });

  const { mutate: updateChat } = useMutation({
    mutationFn: (args: {
      params: UpdateChatParams;
      request: UpdateChatRequest;
    }) => services.chat.updateChat(args.params, args.request),
    onMutate: async (args) => {
      const previousChat = queryClient.getQueryData<Chat>([
        "chat",
        args.params.chatId,
      ]);

      queryClient.setQueryData<Chat>(["chat", args.params.chatId], (chat) =>
        chat != null ? { ...chat, title: args.request.title } : chat
      );

      return { previousChat };
    },
    onError: (_, args, context) => {
      queryClient.setQueryData<Chat>(
        ["chat", args.params.chatId],
        context?.previousChat
      );
    },
  });

  const { mutate: deleteChat } = useMutation({
    mutationFn: (args: { params: DeleteChatParams }) =>
      services.chat.deleteChat(args.params),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      queryClient.setQueryData<Chat[]>(["chats"], (chats) =>
        chats?.filter((chat) => chat.id !== args.params.chatId)
      );

      navigate("/");

      return { previousChats };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<Chat[]>(["chats"], context?.previousChats);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });

  useEffect(() => {
    setChatId(paramsChatId ?? uuid());
  }, [paramsChatId]);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [chat?.messages]);

  function handleSendMessage() {
    setMessage("");

    if (chat == null) {
      createChat({ request: { id: chatId, message } });
    } else {
      sendMessage({
        params: { chatId: chat.id },
        request: { id: uuid(), content: message },
      });
    }
  }

  function handleRenameChat(title: string) {
    updateChat({ params: { chatId }, request: { title } });
    setIsRenameChatDialogOpen(false);
  }

  function handleDeleteChat() {
    deleteChat({ params: { chatId } });
    setIsDeleteChatDialogOpen(false);
  }

  return (
    <Fragment>
      <ContentPanel>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "36px",
            marginLeft: "48px",
          }}
        >
          <ChatTitleMenu
            title={chat?.title ?? ""}
            onRename={() => setIsRenameChatDialogOpen(true)}
            onDelete={() => setIsDeleteChatDialogOpen(true)}
          />
        </Box>
        {chat == null ? (
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Typography variant="h5">Welcome back, Lucas!</Typography>
          </Box>
        ) : (
          <Box
            ref={scrollContainerRef}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "32px",
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
                maxWidth: "800px",
              }}
            >
              {chat.messages?.map((message) =>
                message.role === "user" ? (
                  <UserMessage key={message.id} message={message} />
                ) : (
                  <AssistantMessage key={message.id} message={message} />
                )
              )}
            </Box>
          </Box>
        )}
        <ChatInput
          placeholder={
            chat == null ? "How can i help you today?" : "Reply to assistant..."
          }
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onSubmit={handleSendMessage}
          disabled={StringUtils.isNullOrWhitespace(message)}
        />
      </ContentPanel>
      <RenameChatDialog
        isOpen={isRenameChatDialogOpen}
        title={chat?.title ?? ""}
        onRename={handleRenameChat}
        onCancel={() => setIsRenameChatDialogOpen(false)}
      />
      <DeleteChatDialog
        isOpen={isDeleteChatDialogOpen}
        onDelete={handleDeleteChat}
        onCancel={() => setIsDeleteChatDialogOpen(false)}
      />
    </Fragment>
  );
}
