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
import { ChatList, ChatListItem } from "../chat/chat-list";
import { DeleteChatDialog } from "../chat/delete-chat-dialog";
import { RenameChatDialog } from "../chat/rename-chat-dialog";
import { ShadowButton } from "../ui/button";
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

  const [search, setSearch] = useState(paramsSearch);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [openDialog, setOpenDialog] = useState<
    "rename-chat" | "delete-chat" | "none"
  >("none");

  const debouncedSearchTimeoutRef = useRef<any>(null);

  const { data, isLoading, hasNextPage, fetchNextPage } = useProjectChats(
    props.project.id,
    { search: paramsSearch, limit: 25 }
  );
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginTop: "8px",
        overflow: "hidden",
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
          {t("project.title.chats")}
        </Text>
        <LinkButton to={`/new?projectId=${props.project.id}`}>
          {t("project.button.new_chat")}
        </LinkButton>
      </Box>
      <Box>
        <Input
          placeholder={t("project.placeholder.search")}
          fullWidth
          value={search}
          onChange={handleSearchChange}
        />
        <Text
          sx={{ paddingInline: "16px", color: "secondary.main" }}
          variant="caption"
        >
          {t("project.text.total_chats", { total: totalChats })}
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
          <Text>{t("project.text.no_chats")}</Text>
          <Link to={`/new?projectId=${props.project.id}`}>
            {t("project.button.start_new_chat")}
          </Link>
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ChatList data-testid="project-chat-list">
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
            sx={{ width: "100%", marginBlock: "8px" }}
            onClick={() => fetchNextPage()}
          >
            {t("project.button.load_more")}
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
    </Box>
  );
}
