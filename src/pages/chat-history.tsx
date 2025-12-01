import { Box } from "@mui/material";
import { MessageCircleIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { ChatList, ChatListItem } from "../components/chat/chat-list";
import { DeleteChatDialog } from "../components/chat/delete-chat-dialog";
import { RenameChatDialog } from "../components/chat/rename-chat-dialog";
import { ContentPanel } from "../components/layout/content-panel";
import { ShadowButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, LinkButton } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useDeleteChat, useHistoryChats, useUpdateChat } from "../hooks/chat";
import { Chat } from "../models/entities/chat";
import { ArrayUtils } from "../utils/arrays";

export function ChatHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const paramsSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(paramsSearch);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [openDialog, setOpenDialog] = useState<
    "rename-chat" | "delete-chat" | "none"
  >("none");

  const debouncedSearchTimeoutRef = useRef<any>(null);

  const { data, hasNextPage, isLoading, fetchNextPage } = useHistoryChats({
    search: paramsSearch,
    limit: 25,
  });
  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  const chats = data?.pages.flatMap((page) => page.items) ?? [];
  const totalChats = data?.pages[0]?.totalItems ?? 0;

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
            {t("chat.title.chat_history")}
          </Text>
          <LinkButton to="/">
            <PlusIcon size="16px" />
            {t("chat.button.new_chat")}
          </LinkButton>
        </Box>
        <Box>
          <Input
            sx={{ width: "100%", maxWidth: "800px" }}
            placeholder={t("chat.placeholder.search")}
            fullWidth
            value={search}
            onChange={handleSearchChange}
          />
          <Text
            sx={{ paddingInline: "16px", color: "secondary.main" }}
            variant="caption"
          >
            {t("chat.text.total_chats", { total: totalChats })}
          </Text>
        </Box>
      </Box>
      {!isLoading && ArrayUtils.isNullOrEmpty(chats) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px",
          }}
        >
          <Box>
            <MessageCircleIcon size="20px" />
          </Box>
          <Text>{t("chat.text.no_chats")}</Text>
          <Link to="/new">{t("chat.link.start_new_chat")}</Link>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "16px",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ChatList data-testid="history-chat-list">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              sx={{ paddingInline: "16px" }}
              chat={chat}
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
        </ChatList>
        {hasNextPage && (
          <ShadowButton
            sx={{ marginBlock: "8px" }}
            onClick={() => fetchNextPage()}
          >
            {t("chat.button.load_more")}
          </ShadowButton>
        )}
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
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
