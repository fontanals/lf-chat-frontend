import { Box } from "@mui/material";
import { MessageCircleIcon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import {
  useDeleteChat,
  useProjectChats,
  useUpdateChat,
} from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { Project } from "../../models/entities/project";
import { ArrayUtils } from "../../utils/arrays";
import { SearchParamsUtils } from "../../utils/search-params";
import { ChatList, ChatListItem } from "../chat/chat-list";
import { DeleteChatDialog } from "../chat/delete-chat-dialog";
import { RenameChatDialog } from "../chat/rename-chat-dialog";
import { Input } from "../ui/input";
import { Link, LinkButton } from "../ui/link";
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

  const { data, isLoading } = useProjectChats(props.project.id, {
    search: paramsSearch,
    cursor: cursor ?? undefined,
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
        width: "100%",
        maxWidth: "800px",
        marginTop: "8px",
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
        <Text sx={{ paddingInline: "16px", color: "text.secondary" }}>
          {t("chats")}
        </Text>
        <LinkButton to={`/new?projectId=${props.project.id}`}>
          {t("new_chat")}
        </LinkButton>
      </Box>
      <Box>
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
          {t("total_chats_found", { total: totalChats })}
        </Text>
      </Box>
      {!isLoading && ArrayUtils.isNullOrEmpty(chats) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px",
          }}
        >
          <Box>
            <MessageCircleIcon size="20px" />
          </Box>
          <Text>{t("no_chats_yet")}</Text>
          <Link to={`/new?projectId=${props.project.id}`}>
            {t("start_a_new_chat")}
          </Link>
        </Box>
      )}
      <ChatList
        sx={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {chats.map((chat) => (
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
