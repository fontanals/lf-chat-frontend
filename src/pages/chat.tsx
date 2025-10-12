import { Box } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import {
  AssistantMessageComponent,
  ChatMessage,
} from "../components/chat/chat-message";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import {
  useChat,
  useChatMessages,
  useCreateChat,
  useDeleteChat,
  useSendMessage,
  useUpdateChat,
} from "../hooks/chat";
import { useUploadDocuments } from "../hooks/document";
import { UserContentPart } from "../models/entities/message";
import { useChatStore } from "../state/chat";
import { ArrayUtils } from "../utils/arrays";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { chatId } = useParams();
  const { t } = useTranslation();

  const { pendingMessage, streamingAnswer, setPendingMessage } = useChatStore();

  const [activePath, setActivePath] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: chat, isLoading } = useChat(chatId!);
  const { data: messageTree } = useChatMessages(
    chatId!,
    pendingMessage == null
  );
  const { uploadMap, uploadDocument, deleteDocument } = useUploadDocuments();
  const { mutate: createChat } = useCreateChat(messagesContainerRef);
  const { mutate: sendMessage } = useSendMessage(messagesContainerRef);
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  useEffect(() => {
    if (pendingMessage != null && pendingMessage.chatId === chatId) {
      createChat(
        {
          request: {
            id: chatId!,
            message: pendingMessage.message,
            projectId: pendingMessage.projectId,
          },
        },
        { onSuccess: () => setPendingMessage(null) }
      );
    }
  }, [chatId, pendingMessage, createChat, setPendingMessage]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [messageTree]);

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
    if (
      StringUtils.isNullOrWhitespace(message) &&
      ArrayUtils.isNullOrEmpty(Object.keys(uploadMap))
    ) {
      return;
    }

    const contentParts: UserContentPart[] = [];

    Object.values(uploadMap).forEach((item) =>
      contentParts.push({
        type: "document",
        id: item.id,
        name: item.name,
        mimetype: item.mimetype,
      })
    );

    contentParts.push({ type: "text", text: message });

    if (chat == null) {
      createChat({ request: { id: chatId!, message: contentParts } });
    } else {
      sendMessage({
        params: { chatId: chat.id },
        request: {
          id: uuid(),
          content: contentParts,
          parentMessageId: activePath[activePath.length - 1],
        },
      });
    }

    setMessage("");
  }

  function handleEditMessage(
    content: UserContentPart[],
    parentMessageId?: string | null
  ) {
    sendMessage({
      params: { chatId: chatId! },
      request: { id: uuid(), content, parentMessageId },
    });
  }

  if (isLoading) {
    return (
      <ContentPanel>
        <LoadingBackdrop isLoading />
      </ContentPanel>
    );
  }

  if (chat == null && pendingMessage == null) {
    return <Navigate to="/" replace />;
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
          {chat != null && (
            <ChatTitleMenu
              chat={chat}
              onRenameChat={() => setIsRenameChatDialogOpen(true)}
              onDeleteChat={() => setIsDeleteChatDialogOpen(true)}
            />
          )}
        </Box>
        <Box
          ref={messagesContainerRef}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "16px",
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
            <ChatMessage
              activePath={activePath}
              messageIds={messageTree?.rootMessageIds ?? []}
              messages={messageTree?.messages ?? {}}
              onSelectMessage={handleSelectMessage}
              onEditMessage={handleEditMessage}
            />
            {streamingAnswer != null && (
              <AssistantMessageComponent
                message={streamingAnswer}
                hideActions
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ChatInput
            containerSx={{ maxWidth: "600px" }}
            placeholder={t("reply_to_assistant")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onSubmit={handleSendMessage}
            uploadMap={uploadMap}
            onAddDocuments={handleAddDocuments}
            onRemoveDocument={handleRemoveDocument}
            disabled={StringUtils.isNullOrWhitespace(message)}
          />
        </Box>
      </ContentPanel>
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
    </Fragment>
  );
}
