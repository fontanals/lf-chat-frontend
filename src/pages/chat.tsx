import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircleOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessage } from "../components/chat/chat-message";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { ContinueMessage } from "../components/chat/continue-message";
import { ContentPanel } from "../components/layout/content-panel";
import { Link } from "../components/ui/link";
import { Text } from "../components/ui/text";
import {
  useChat,
  useChatMessages,
  useCreateChat,
  useSendMessage,
} from "../hooks/chat";
import { UserContentBlock } from "../models/entities/message";
import { useChatStore } from "../state/chat";

export function ChatPage() {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { pendingChats, streamingMessages, removePendingChat } = useChatStore();
  const pendingChat = pendingChats[chatId!];
  const streamingMessage = streamingMessages[chatId!];

  const [activePath, setActivePath] = useState<string[]>([]);
  const [showContinueMessage, setShowContinueMessage] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: chat, isLoading: isLoadingChat } = useChat(chatId!, {
    expand: ["project"],
  });
  const { data: messageTree } = useChatMessages(chatId!, pendingChat == null);
  const {
    mutate: createChat,
    isPending: isPendingCreateChat,
    onAbort: abortCreateChat,
  } = useCreateChat();
  const {
    mutate: sendMessage,
    isPending: isPendingSendMessage,
    onAbort: abortSendMessage,
  } = useSendMessage();

  useEffect(() => {
    if (pendingChat != null) {
      removePendingChat(pendingChat.id);

      createChat({ request: pendingChat });
    }
  }, [pendingChat, createChat, removePendingChat]);

  useEffect(() => {
    const lastMessageId =
      messageTree?.latestPath[messageTree.latestPath.length - 1];
    const lastMessage = lastMessageId
      ? messageTree?.messages[lastMessageId]
      : null;

    if (
      lastMessage?.role === "assistant" &&
      (lastMessage.finishReason === "length" ||
        lastMessage.finishReason === "tool-calls")
    ) {
      setShowContinueMessage(true);
    }

    setActivePath(messageTree?.latestPath ?? []);
  }, [messageTree]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [activePath]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [streamingMessage]);

  function handleSelectMessage(messageId: string) {
    const message = messageTree?.messages[messageId];

    if (message == null) {
      return;
    }

    const newActivePath = activePath.slice(
      0,
      message.parentMessageId != null
        ? activePath.indexOf(message.parentMessageId) + 1
        : 0
    );

    newActivePath.push(message.id);

    let nextMessageId =
      message.childrenMessageIds?.[message.childrenMessageIds.length - 1];

    while (nextMessageId != null) {
      let nextMessage = messageTree?.messages[nextMessageId];

      newActivePath.push(nextMessageId);

      nextMessageId =
        nextMessage?.childrenMessageIds?.[
          nextMessage.childrenMessageIds.length - 1
        ];
    }

    setActivePath(newActivePath);
  }

  function handleSendMessage(content: UserContentBlock[]) {
    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content,
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });
  }

  function handleEditMessage(
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) {
    sendMessage({
      params: { chatId: chatId! },
      request: { id: uuid(), content, parentMessageId },
    });
  }

  function handleContinueMessage() {
    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content: [{ type: "text", id: uuid(), text: t("chat.text.continue") }],
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });
  }

  function handleStopStream() {
    abortCreateChat();
    abortSendMessage();

    queryClient.invalidateQueries({ queryKey: ["chats"] });
    queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
  }

  if (pendingChat == null && !isLoadingChat && chat == null) {
    return (
      <ContentPanel>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box>
            <MessageCircleOffIcon size="24px" />
          </Box>
          <Text>{t("chat.error.chat_not_found")}</Text>
          <Link to="/new">{t("chat.link.start_new_chat")}</Link>
        </Box>
      </ContentPanel>
    );
  }

  return (
    <ContentPanel>
      {chat != null && <ChatTitleMenu chat={chat} />}
      <Box
        ref={messagesContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          height: "100%",
          maxWidth: "800px",
          marginTop: "32px",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {activePath.map((messageId) => {
          const message = messageTree?.messages[messageId];
          const parentMessage =
            message?.parentMessageId != null
              ? messageTree?.messages[message.parentMessageId]
              : null;

          if (message == null) {
            return null;
          }

          return (
            <ChatMessage
              key={message.id}
              messageIds={
                parentMessage?.childrenMessageIds ??
                messageTree?.rootMessageIds ?? [message.id]
              }
              message={message}
              onSelect={handleSelectMessage}
              onEdit={handleEditMessage}
            />
          );
        })}
        {streamingMessage != null &&
          streamingMessage.id !== activePath[activePath.length - 1] && (
            <ChatMessage
              key={streamingMessage.id}
              messageIds={[streamingMessage.id]}
              message={streamingMessage}
              onSelect={handleSelectMessage}
              onEdit={handleEditMessage}
              isStreaming
            />
          )}
        {showContinueMessage && (
          <ContinueMessage
            onAccept={handleContinueMessage}
            onDismiss={() => setShowContinueMessage(false)}
          />
        )}
      </Box>
      <ChatInput
        containerSx={{ maxWidth: "600px", marginTop: "32px" }}
        placeholder={t("chat.placeholder.new_message")}
        isStreaming={isPendingCreateChat || isPendingSendMessage}
        onSendMessage={handleSendMessage}
        onStopStream={handleStopStream}
      />
      <Text
        sx={{ maxWidth: "600px", marginTop: "8px", color: "secondary.main" }}
        variant="caption"
      >
        {t("common.text.transparency_notice")}
      </Text>
    </ContentPanel>
  );
}
