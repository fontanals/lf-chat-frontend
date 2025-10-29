import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessage, ContinueMessage } from "../components/chat/chat-message";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
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
import { useAlertStore } from "../state/alert";
import { useChatStore } from "../state/chat";
import { ObjectUtils } from "../utils/objects";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const displayAlert = useAlertStore((state) => state.displayAlert);

  const { pendingMessages, streamingMessages, removePendingMessage } =
    useChatStore();
  const pendingMessage = pendingMessages[chatId!];
  const streamingMessage = streamingMessages[chatId!];

  const [activePath, setActivePath] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showContinueMessage, setShowContinueMessage] = useState(false);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: chat, isLoading: isLoadingChat } = useChat(chatId!, {
    expand: ["project"],
  });
  const { data: messageTree } = useChatMessages(
    chatId!,
    pendingMessage == null
  );
  const { mutate: createChat, isPending: isPendingCreateChat } = useCreateChat(
    abortControllerRef,
    setShowContinueMessage
  );
  const { mutate: sendMessage, isPending: isPendingSendMessage } =
    useSendMessage(abortControllerRef, setShowContinueMessage);
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: updateMessage } = useUpdateMessage();
  const { mutate: deleteChat } = useDeleteChat();
  const { uploadMap, uploadDocument } = useUploadDocuments();
  const { mutate: deleteDocument } = useDeleteDocument();

  useEffect(() => {
    if (pendingMessage != null) {
      removePendingMessage(pendingMessage.chatId);

      createChat({
        request: {
          id: pendingMessage.chatId,
          message: pendingMessage.content,
          projectId: pendingMessage.projectId,
        },
      });
    }
  }, [pendingMessage, createChat, removePendingMessage]);

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
    if (
      chat == null &&
      pendingMessage == null &&
      !isLoadingChat &&
      !isPendingCreateChat
    ) {
      displayAlert({ severity: "error", message: t("chat_not_found_alert") });

      navigate("/new");
    }
  }, [chat, pendingMessage, isLoadingChat, isPendingCreateChat]);

  function handleRenameChat(title: string) {
    setIsRenameChatDialogOpen(false);

    updateChat({ params: { chatId: chatId! }, request: { title } });
  }

  function handleDeleteChat() {
    setIsDeleteChatDialogOpen(false);

    deleteChat({ params: { chatId: chatId! } });
  }

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
        content: [{ type: "text", text: message }],
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

  function handleEditMessage(
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) {
    sendMessage({
      params: { chatId: chatId! },
      request: { id: uuid(), content, parentMessageId },
    });
  }

  function handleChangeMessageFeedback(
    messageId: string,
    feedback: MessageFeedback | null
  ) {
    updateMessage({
      params: { chatId: chatId!, messageId },
      request: { feedback },
    });
  }

  function handleContinueMessage() {
    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content: [{ type: "text", text: t("continue") }],
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });
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
      <Virtuoso
        style={{
          width: "100%",
          maxWidth: "800px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        followOutput="smooth"
        data={[
          ...activePath,
          streamingMessage != null ? "streaming" : null,
          showContinueMessage ? "continue" : null,
        ].filter((messageId) => messageId != null)}
        itemContent={(index, messageId) => {
          if (messageId === "continue") {
            return (
              <ContinueMessage
                onDismiss={() => setShowContinueMessage(false)}
                onAccept={handleContinueMessage}
              />
            );
          }

          const message =
            messageId === "streaming"
              ? streamingMessage
              : messageTree?.messages[messageId];

          if (message == null) {
            return null;
          }

          const parentMessage =
            message?.parentMessageId != null
              ? messageTree?.messages[message.parentMessageId]
              : null;

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
              hideActions={index === activePath.length}
            />
          );
        }}
      />
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
