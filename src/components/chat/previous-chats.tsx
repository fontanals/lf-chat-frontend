import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChats, useDeleteChat, useUpdateChat } from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { useSidebarStore } from "../../state/sidebar";
import { ArrayUtils } from "../../utils/arrays";
import { Text } from "../ui/text";
import { ChatList, ChatListItem } from "./chat-list";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { RenameChatDialog } from "./rename-chat-dialog";

export function PreviousChats() {
  const theme = useTheme();
  const { t } = useTranslation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen } =
    useSidebarStore();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const { data: paginatedChats } = useChats();
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  function handleSelectChat() {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  function handleRenameChat(title: string) {
    if (selectedChat != null) {
      updateChat({ params: { chatId: selectedChat.id }, request: { title } });
    }

    setIsRenameChatDialogOpen(false);
    setSelectedChat(null);
  }

  function handleDeleteChat() {
    if (selectedChat != null) {
      deleteChat({ params: { chatId: selectedChat.id } });
    }

    setIsDeleteChatDialogOpen(false);
    setSelectedChat(null);
  }

  return (
    <Fragment>
      <Box
        sx={{
          flex: 1,
          width: isSidebarOpen ? "100%" : "0px",
          marginTop: "16px",
          marginBottom: "16px",
          textWrap: "nowrap",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {!ArrayUtils.isNullOrEmpty(paginatedChats?.chats) && (
          <Text sx={{ padding: "0px 8px", color: "text.secondary" }}>
            {t("previous_chats")}
          </Text>
        )}
        <ChatList sx={{ marginTop: "8px", padding: "0px" }}>
          {paginatedChats?.chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              sx={{ "&:hover": { backgroundColor: "background.paper" } }}
              chat={chat}
              onSelectChat={handleSelectChat}
              onRenameChat={() => {
                setSelectedChat(chat);
                setIsRenameChatDialogOpen(true);
              }}
              onDeleteChat={() => {
                setSelectedChat(chat);
                setIsDeleteChatDialogOpen(true);
              }}
            />
          ))}
        </ChatList>
      </Box>
      <RenameChatDialog
        isOpen={isRenameChatDialogOpen}
        title={selectedChat?.title ?? ""}
        onRenameChat={handleRenameChat}
        onCancel={() => {
          setIsRenameChatDialogOpen(false);
          setSelectedChat(null);
        }}
      />
      <DeleteChatDialog
        isOpen={isDeleteChatDialogOpen}
        onDeleteChat={handleDeleteChat}
        onCancel={() => {
          setIsDeleteChatDialogOpen(false);
          setSelectedChat(null);
        }}
      />
    </Fragment>
  );
}
