import { Box } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { useChats, useDeleteChat, useUpdateChat } from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { Project } from "../../models/entities/project";
import { SearchParamsUtils } from "../../utils/search-params";
import { ChatList, ChatListItem } from "../chat/chat-list";
import { DeleteChatDialog } from "../chat/delete-chat-dialog";
import { RenameChatDialog } from "../chat/rename-chat-dialog";
import { Input } from "../ui/input";
import { Text } from "../ui/text";

export type ProjectChatsProps = {
  project: Project;
};

export function ProjectChats(props: ProjectChatsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const paramsSearch = searchParams.get("search") ?? "";
  const cursor = SearchParamsUtils.getDate(searchParams, "cursor");

  const [search, setSearch] = useState(paramsSearch);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const debouncedSearchTimeoutRef = useRef<any>(null);

  const { data: paginatedChats } = useChats({
    search: paramsSearch,
    projectId: props.project.id,
    cursor: cursor ?? undefined,
    limit: 20,
  });
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);

    if (debouncedSearchTimeoutRef.current) {
      clearTimeout(debouncedSearchTimeoutRef.current);
    }

    debouncedSearchTimeoutRef.current = setTimeout(() => {
      searchParams.set("search", event.target.value);
      setSearchParams(searchParams);
    }, 300);
  }

  function handleRenameChat(title: string) {
    if (selectedChat != null) {
      updateChat({ params: { chatId: selectedChat.id }, request: { title } });
    }
  }

  function handleDeleteChat() {
    if (selectedChat != null) {
      deleteChat({ params: { chatId: selectedChat.id } });
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginTop: "8px",
      }}
    >
      <Text sx={{ paddingInline: "16px", color: "text.secondary" }}>
        {t("chats")}
      </Text>
      <Input
        placeholder={t("search")}
        fullWidth
        value={search}
        onChange={handleSearchChange}
      />
      <Text
        sx={{ paddingInline: "16px", color: "secondary.main" }}
        variant="caption"
      >
        {t("total_chats_found", { total: paginatedChats?.totalChats ?? 0 })}
      </Text>
      <ChatList>
        {paginatedChats?.chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            sx={{ paddingInline: "16px" }}
            chat={chat}
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
      <RenameChatDialog
        isOpen={isRenameChatDialogOpen}
        title={selectedChat?.title ?? ""}
        onRenameChat={handleRenameChat}
        onCancel={() => setIsRenameChatDialogOpen(false)}
      />
      <DeleteChatDialog
        isOpen={isDeleteChatDialogOpen}
        onDeleteChat={handleDeleteChat}
        onCancel={() => setIsDeleteChatDialogOpen(false)}
      />
    </Box>
  );
}
