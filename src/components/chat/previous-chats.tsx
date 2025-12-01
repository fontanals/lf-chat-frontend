import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  useDeleteChat,
  usePreviousChats,
  useUpdateChat,
} from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { useSidebarStore } from "../../state/sidebar";
import { ArrayUtils } from "../../utils/arrays";
import { LinkButton } from "../ui/link";
import { Text } from "../ui/text";
import { ChatList, ChatListItem } from "./chat-list";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { RenameChatDialog } from "./rename-chat-dialog";

export function PreviousChats() {
  const { chatId } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen } =
    useSidebarStore();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [openDialog, setOpenDialog] = useState<
    "rename-chat" | "delete-chat" | "none"
  >("none");

  const { data: chats } = usePreviousChats();
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

    setSelectedChat(null);
    setOpenDialog("none");
  }

  function handleDeleteChat() {
    if (selectedChat != null) {
      deleteChat({ params: { chatId: selectedChat.id } });
    }

    setSelectedChat(null);
    setOpenDialog("none");
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
          overflow: "hidden",
        }}
      >
        {!ArrayUtils.isNullOrEmpty(chats?.items) && (
          <Text sx={{ padding: "0px 8px", color: "text.secondary" }}>
            {t("chat.text.previous_chats")}
          </Text>
        )}
        <ChatList
          sx={{
            height: "90%",
            marginTop: "16px",
            padding: "0px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {chats?.items.map((chat) => (
            <ChatListItem
              key={chat.id}
              sx={{
                backgroundColor:
                  chat.id === chatId
                    ? "background.paper"
                    : "background.default",
                "&:hover": { backgroundColor: "background.paper" },
              }}
              chat={chat}
              onSelect={handleSelectChat}
              onRename={() => {
                setSelectedChat(chat);
                setOpenDialog("rename-chat");
              }}
              onDelete={() => {
                setSelectedChat(chat);
                setOpenDialog("delete-chat");
              }}
            />
          ))}
          {(chats?.totalItems ?? 0) > 25 && (
            <LinkButton style={{ justifyContent: "center" }} to="/history">
              {t("chat.button.complete_history")}
            </LinkButton>
          )}
        </ChatList>
      </Box>
      <RenameChatDialog
        isOpen={openDialog === "rename-chat"}
        title={selectedChat?.title ?? ""}
        onRename={handleRenameChat}
        onCancel={() => {
          setSelectedChat(null);
          setOpenDialog("none");
        }}
      />
      <DeleteChatDialog
        isOpen={openDialog === "delete-chat"}
        onDelete={handleDeleteChat}
        onCancel={() => {
          setSelectedChat(null);
          setOpenDialog("none");
        }}
      />
    </Fragment>
  );
}
