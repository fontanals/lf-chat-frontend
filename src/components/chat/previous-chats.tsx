import { Box } from "@mui/material";
import { Fragment, useState } from "react";
import { Link } from "react-router";
import { useChats, useDeleteChat, useUpdateChat } from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { Text } from "../ui/text";
import { ChatList, ChatListItem } from "./chat-list";
import { ChatMenu } from "./chat-menu";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { RenameChatDialog } from "./rename-chat-dialog";

export type PreviousChatsProps = {
  isOpen: boolean;
};

export function PreviousChats(props: PreviousChatsProps) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMenuAnchorElement, setChatMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const { data: paginatedChats } = useChats();
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

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
          width: props.isOpen ? "100%" : "0px",
          marginTop: "16px",
          marginBottom: "16px",
          textWrap: "nowrap",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Text sx={{ padding: "0px 8px", color: "text.secondary" }}>
          Previous Chats
        </Text>
        <ChatList sx={{ marginTop: "8px", padding: "0px" }}>
          {paginatedChats?.chats.map((chat) => (
            <Link key={chat.id} to={`/chat/${chat.id}`}>
              <ChatListItem
                sx={{ "&:hover": { backgroundColor: "background.paper" } }}
                chat={chat}
                onMenuClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedChat(chat);
                  setChatMenuAnchorElement(event.currentTarget);
                }}
              />
            </Link>
          ))}
        </ChatList>
        <ChatMenu
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          anchorElement={chatMenuAnchorElement}
          onRename={() => {
            setChatMenuAnchorElement(null);
            setIsRenameChatDialogOpen(true);
          }}
          onDelete={() => {
            setChatMenuAnchorElement(null);
            setIsDeleteChatDialogOpen(true);
          }}
          onClose={() => {
            setSelectedChat(null);
            setChatMenuAnchorElement(null);
          }}
        />
      </Box>
      <RenameChatDialog
        isOpen={isRenameChatDialogOpen}
        title={selectedChat?.title ?? ""}
        onRename={handleRenameChat}
        onCancel={() => {
          setIsRenameChatDialogOpen(false);
          setSelectedChat(null);
        }}
      />
      <DeleteChatDialog
        isOpen={isDeleteChatDialogOpen}
        onDelete={handleDeleteChat}
        onCancel={() => {
          setIsDeleteChatDialogOpen(false);
          setSelectedChat(null);
        }}
      />
    </Fragment>
  );
}
