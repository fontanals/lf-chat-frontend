import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircleOffIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessage, ContinueMessage } from "../components/chat/chat-message";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { Link } from "../components/ui/link";
import { Text } from "../components/ui/text";
import {
  useChat,
  useChatMessages,
  useCreateChat,
  useDeleteChat,
  useSendMessage,
  useUpdateChat,
  useUpdateMessage,
} from "../hooks/chat";
import { useDeleteDocument, useUploadDocuments } from "../hooks/document";
import { MessageFeedback, UserContentBlock } from "../models/entities/message";
import { useChatStore } from "../state/chat";
import { ObjectUtils } from "../utils/objects";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { pendingChats, streamingMessages, removePendingChat } = useChatStore();
  const pendingChat = pendingChats[chatId!];
  const streamingMessage = streamingMessages[chatId!];

  const [activePath, setActivePath] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showContinueMessage, setShowContinueMessage] = useState(false);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: chat, isLoading: isLoadingChat } = useChat(chatId!, {
    expand: ["project"],
  });
  const { data: messageTree } = useChatMessages(chatId!, pendingChat == null);
  const { mutate: createChat, isPending: isPendingCreateChat } = useCreateChat(
    abortControllerRef,
    messagesContainerRef,
    setShowContinueMessage
  );
  const { mutate: sendMessage, isPending: isPendingSendMessage } =
    useSendMessage(
      abortControllerRef,
      messagesContainerRef,
      setShowContinueMessage
    );
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: updateMessage } = useUpdateMessage();
  const { mutate: deleteChat } = useDeleteChat();
  const { uploadMap, uploadDocument } = useUploadDocuments();
  const { mutate: deleteDocument } = useDeleteDocument();

  useEffect(() => {
    if (pendingChat != null) {
      removePendingChat(pendingChat.chat.id);

      createChat(pendingChat);
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

  function handleRenameChat(title: string) {
    setIsRenameChatDialogOpen(false);

    updateChat({ params: { chatId: chatId! }, request: { title } });
  }

  function handleDeleteChat() {
    setIsDeleteChatDialogOpen(false);

    deleteChat({ params: { chatId: chatId! } });
  }

  const handleSelectMessage = useCallback(
    (messageId: string) => {
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
    },
    [activePath, messageTree]
  );

  function handleAddDocuments(files: File[]) {
    files.forEach((file) => uploadDocument({ request: { id: uuid(), file } }));
  }

  function handleRemoveDocument(id: string) {
    deleteDocument({ params: { documentId: id } });
  }

  function handleSendMessage() {
    if (StringUtils.isNullOrWhitespace(message)) {
      return;
    }

    setMessage("");

    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content: [{ type: "text", id: uuid(), text: message }],
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });
  }

  function handleStopStreaming() {
    abortControllerRef.current?.abort();

    queryClient.invalidateQueries({ queryKey: ["chats"] });
    queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
  }

  const handleEditMessage = useCallback(
    (content: UserContentBlock[], parentMessageId?: string | null) => {
      sendMessage({
        params: { chatId: chatId! },
        request: { id: uuid(), content, parentMessageId },
      });
    },
    [chatId, sendMessage]
  );

  const handleChangeMessageFeedback = useCallback(
    (messageId: string, feedback: MessageFeedback | null) => {
      updateMessage({
        params: { chatId: chatId!, messageId },
        request: { feedback },
      });
    },
    [chatId, updateMessage]
  );

  function handleContinueMessage() {
    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content: [{ type: "text", id: uuid(), text: t("continue") }],
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });
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
          <Text>{t("chat_not_found")}</Text>
          <Link to="/new">{t("start_a_new_chat")}</Link>
        </Box>
      </ContentPanel>
    );
  }

  return (
    <ContentPanel>
      {chat != null && (
        <ChatTitleMenu
          chat={chat}
          onRenameChat={() => setIsRenameChatDialogOpen(true)}
          onDeleteChat={() => setIsDeleteChatDialogOpen(true)}
        />
      )}
      <Box
        ref={messagesContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          height: "100%",
          maxWidth: "800px",
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
              onSelectMessage={handleSelectMessage}
              onEditMessage={handleEditMessage}
              onChangeMessageFeedback={handleChangeMessageFeedback}
            />
          );
        })}
        {streamingMessage != null &&
          streamingMessage.id !== activePath[activePath.length - 1] && (
            <ChatMessage
              key={streamingMessage.id}
              messageIds={[streamingMessage.id]}
              message={streamingMessage}
              onSelectMessage={handleSelectMessage}
              onEditMessage={handleEditMessage}
              onChangeMessageFeedback={handleChangeMessageFeedback}
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
        containerSx={{ marginTop: "32px", maxWidth: "600px" }}
        placeholder={t("reply_to_assistant")}
        isStreaming={isPendingCreateChat || isPendingSendMessage}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onSubmit={handleSendMessage}
        onStop={handleStopStreaming}
        uploadMap={uploadMap}
        onAddDocuments={handleAddDocuments}
        onRemoveDocument={handleRemoveDocument}
        disabled={
          !isPendingCreateChat &&
          !isPendingSendMessage &&
          StringUtils.isNullOrWhitespace(message) &&
          ObjectUtils.isEmpty(uploadMap)
        }
      />
      <RenameChatDialog
        isOpen={isRenameChatDialogOpen}
        title={chat?.title ?? ""}
        onRenameChat={handleRenameChat}
        onCancel={() => setIsRenameChatDialogOpen(false)}
      />
      <DeleteChatDialog
        isOpen={isDeleteChatDialogOpen}
        onDeleteChat={handleDeleteChat}
        onCancel={() => setIsDeleteChatDialogOpen(false)}
      />
    </ContentPanel>
  );
}
