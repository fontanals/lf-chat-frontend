import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EllipsisVerticalIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Chat } from "../../models/entities/chat";
import {
  DeleteChatParams,
  UpdateChatParams,
  UpdateChatRequest,
} from "../../models/requests/chat";
import { services } from "../../services/provider";
import { ChatMenu } from "./chat-menu";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { RenameChatDialog } from "./rename-chat-dialog";

export type ChatHistoryProps = {
  isOpen: boolean;
};

export function ChatHistory(props: ChatHistoryProps) {
  const { chatId: paramsChatId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMenuAnchorElement, setChatMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const [isRenameChatDialogOpen, setIsRenameChatDialogOpen] = useState(false);
  const [isDeleteChatDialogOpen, setIsDeleteChatDialogOpen] = useState(false);

  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => services.chat.getChats(),
  });

  const { mutate: updateChat } = useMutation({
    mutationFn: (args: {
      params: UpdateChatParams;
      request: UpdateChatRequest;
    }) => services.chat.updateChat(args.params, args.request),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      queryClient.setQueryData<Chat[]>(["chats"], (chats) =>
        chats?.map((chat) =>
          chat.id === args.params.chatId
            ? { ...chat, title: args.request.title }
            : chat
        )
      );

      return { previousChats };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<Chat[]>(["chats"], context?.previousChats);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });

  const { mutate: deleteChat } = useMutation({
    mutationFn: (args: { params: DeleteChatParams }) =>
      services.chat.deleteChat(args.params),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      queryClient.setQueryData<Chat[]>(["chats"], (chats) =>
        chats?.filter((chat) => chat.id !== args.params.chatId)
      );

      if (paramsChatId === args.params.chatId) {
        navigate("/");
      }

      return { previousChats };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<Chat[]>(["chats"], context?.previousChats);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });

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
          textWrap: "nowrap",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{ padding: "0px 8px", color: "text.secondary" }}
          variant="body2"
        >
          Previous Chats
        </Typography>
        <List sx={{ marginTop: "8px", padding: "0px" }}>
          {chats?.map((chat) => (
            <Link key={chat.id} to={`/chat/${chat.id}`}>
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderRadius: "8px",
                  textTransform: "none",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#0F172B" },
                }}
              >
                <Typography variant="body2" noWrap>
                  {chat.title}
                </Typography>
                <IconButton
                  sx={{ color: "primary.main" }}
                  size="small"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setChatMenuAnchorElement(event.currentTarget);
                    setSelectedChat(chat);
                  }}
                >
                  <EllipsisVerticalIcon size="16px" />
                </IconButton>
              </ListItem>
            </Link>
          ))}
        </List>
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
