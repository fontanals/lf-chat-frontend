import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessage } from "../components/chat/chat-message";
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
import { useChatStore } from "../state/chat";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { chatId } = useParams();
  const { t } = useTranslation();

  const { pendingMessages, streamingMessages, removePendingMessage } =
    useChatStore();
  const pendingMessage = pendingMessages[chatId!];
  const streamingMessage = streamingMessages[chatId!];

  const [activePath, setActivePath] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const { data: chat } = useChat(chatId!, { expand: ["project"] });
  const { data: messageTree } = useChatMessages(
    chatId!,
    pendingMessage == null
  );
  const { mutate: createChat } = useCreateChat();
  const { mutate: sendMessage } = useSendMessage();
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: updateMessage } = useUpdateMessage();
  const { mutate: deleteChat } = useDeleteChat();
  const { uploadMap, uploadDocument } = useUploadDocuments();
  const { mutate: deleteDocument } = useDeleteDocument();

  useEffect(() => {
    if (pendingMessage != null) {
      createChat(
        {
          request: {
            id: pendingMessage.chatId,
            message: pendingMessage.content,
            projectId: pendingMessage.projectId,
          },
        },
        { onSuccess: () => removePendingMessage(chatId!) }
      );
    }
  }, [pendingMessage, createChat, removePendingMessage]);

  useEffect(() => {
    virtuosoRef.current?.scrollToIndex({ index: "LAST" });
  }, [activePath]);

  useEffect(() => {
    setActivePath(messageTree?.latestPath ?? []);
  }, [messageTree?.latestPath]);

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
    [messageTree, activePath, setActivePath]
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

    sendMessage({
      params: { chatId: chatId! },
      request: {
        id: uuid(),
        content: [{ type: "text", text: message }],
        parentMessageId:
          messageTree?.latestPath[messageTree.latestPath.length - 1],
      },
    });

    setMessage("");
  }

  const handleEditMessage = useCallback(
    (content: UserContentBlock[], parentMessageId?: string | null) => {
      sendMessage({
        params: { chatId: chatId! },
        request: { id: uuid(), content, parentMessageId },
      });
    },
    [sendMessage, chatId]
  );

  const handleChangeMessageFeedback = useCallback(
    (messageId: string, feedback: MessageFeedback | null) => {
      updateMessage({
        params: { chatId: chatId!, messageId },
        request: { feedback },
      });
    },
    [updateMessage, chatId]
  );

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
        key={chatId}
        ref={virtuosoRef}
        followOutput="smooth"
        style={{
          width: "100%",
          maxWidth: "800px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        data={
          streamingMessage != null
            ? activePath.concat(["streaming"])
            : activePath
        }
        itemContent={(index, messageId) => {
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
            <Box key={message.id} sx={{ paddingBlock: "8px" }}>
              <ChatMessage
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
            </Box>
          );
        }}
      />
      <ChatInput
        containerSx={{ marginTop: "32px", maxWidth: "600px" }}
        placeholder={t("reply_to_assistant")}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onSubmit={handleSendMessage}
        uploadMap={uploadMap}
        onAddDocuments={handleAddDocuments}
        onRemoveDocument={handleRemoveDocument}
        disabled={StringUtils.isNullOrWhitespace(message)}
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
