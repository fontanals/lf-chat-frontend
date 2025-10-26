import { Box } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { ChatList, ChatListItem } from "../components/chat/chat-list";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { Input } from "../components/ui/input";
import { LinkButton } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useChats, useDeleteChat, useUpdateChat } from "../hooks/chat";
import { Chat } from "../models/entities/chat";
import { SearchParamsUtils } from "../utils/search-params";
import { PlusIcon } from "lucide-react";

export function ChatHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const paramsSearch = searchParams.get("search") ?? "";
  const cursor = SearchParamsUtils.getDate(searchParams, "cursor");

  const [search, setSearch] = useState(paramsSearch);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const debouncedSearchTimeoutRef = useRef<any>(null);

  const { data: paginatedChats, isLoading } = useChats({
    search: paramsSearch,
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
    <ContentPanel>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <Text sx={{ paddingInline: "16px" }} variant="body1">
            {t("chat_history")}
          </Text>
          <LinkButton to="/">
            <PlusIcon size="16px" />
            {t("new_chat")}
          </LinkButton>
        </Box>
        <Box>
          <Input
            sx={{ width: "100%", maxWidth: "800px" }}
            placeholder={t("search")}
            fullWidth
            value={search}
            onChange={handleSearchChange}
          />
          <Text
            sx={{ paddingInline: "16px", color: "secondary.main" }}
            variant="caption"
          >
            {t("total_chats_found", {
              total: paginatedChats?.totalItems ?? 0,
            })}
          </Text>
        </Box>
      </Box>
      <ChatList
        sx={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "16px",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {paginatedChats?.items.map((chat) => (
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
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
