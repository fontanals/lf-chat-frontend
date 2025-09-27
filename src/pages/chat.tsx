import { Box } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ChatMessage } from "../components/chat/chat-message";
import { ChatTitleMenu } from "../components/chat/chat-title-menu";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { Text } from "../components/ui/text";
import {
  useChat,
  useChatMessages,
  useCreateChat,
  useDeleteChat,
  useSendMessage,
  useUpdateChat,
} from "../hooks/chat";
import { useUser } from "../hooks/user";
import { StringUtils } from "../utils/strings";

export function ChatPage() {
  const { t } = useTranslation();

  const { chatId: paramsChatId } = useParams();

  const [chatId, setChatId] = useState(paramsChatId ?? uuid());
  const [activePath, setActivePath] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: user } = useUser();

  const { data: chat } = useChat(chatId);
  const { data: messageTree } = useChatMessages(chatId);
  const { mutate: createChat } = useCreateChat(messagesContainerRef);
  const { mutate: sendMessage } = useSendMessage(messagesContainerRef);
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  useEffect(() => {
    setChatId(paramsChatId ?? uuid());
  }, [paramsChatId]);

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
    updateChat({ params: { chatId }, request: { title } });
    setIsRenameChatDialogOpen(false);
  }

  function handleDeleteChat() {
    deleteChat({ params: { chatId } });
    setIsDeleteChatDialogOpen(false);
  }

  function handleSelectMessage(messageId: string) {
    const message = messageTree?.messages[messageId];

    if (message == null) {
      return;
    }

    const newActivePath = activePath.slice(
      0,
      message.parentId != null ? activePath.indexOf(message.parentId) + 1 : 0
    );

    newActivePath.push(message.id);

    let nextMessageId = message.childrenIds?.[message.childrenIds.length - 1];

    while (nextMessageId != null) {
      let nextMessage = messageTree?.messages[nextMessageId];

      newActivePath.push(nextMessageId);

      nextMessageId =
        nextMessage?.childrenIds?.[nextMessage.childrenIds.length - 1];
    }

    setActivePath(newActivePath);
  }

  function handleSendMessage() {
    setMessage("");

    if (chat == null) {
      createChat({ request: { id: chatId, message } });
    } else {
      sendMessage({
        params: { chatId: chat.id },
        request: {
          id: uuid(),
          content: message,
          parentId: activePath[activePath.length - 1],
        },
      });
    }
  }

  function handleEditMessage(content: string, parentId?: string | null) {
    sendMessage({
      params: { chatId },
      request: { id: uuid(), content, parentId },
    });
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
        {paramsChatId == null && chat == null ? (
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Text variant="h5">
              {t("welcome_user_name_how_are_you_doing_today", {
                name: user?.displayName,
              })}
            </Text>
          </Box>
        ) : (
          <Box
            ref={messagesContainerRef}
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
              <ChatMessage
                activePath={activePath}
                messageIds={messageTree?.rootMessageIds ?? []}
                messages={messageTree?.messages ?? {}}
                onSelectMessage={handleSelectMessage}
                onEditMessage={handleEditMessage}
              />
            </Box>
          </Box>
        )}
        <ChatInput
          placeholder={
            chat == null
              ? t("how_can_i_help_you_today")
              : t("reply_to_assistant")
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
