import { Box, Button } from "@mui/material";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Link } from "react-router";
import { useDeleteChat, useUpdateChat } from "../../hooks/chat";
import { Chat } from "../../models/entities/chat";
import { Text } from "../ui/text";
import { ChatMenu } from "./chat-menu";
import { DeleteChatDialog } from "./delete-chat-dialog";
import { RenameChatDialog } from "./rename-chat-dialog";

export type ChatTitleMenuProps = {
  chat: Chat;
};

export function ChatTitleMenu(props: ChatTitleMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = useState<
    "rename-chat" | "delete-chat" | "none"
  >("none");

  const { mutate: updateChat } = useUpdateChat();
  const { mutate: deleteChat } = useDeleteChat();

  function handleRenameChat(title: string) {
    updateChat({ params: { chatId: props.chat.id }, request: { title } });

    setOpenDialog("none");
  }

  function handleDeleteChat() {
    deleteChat({ params: { chatId: props.chat.id } });

    setOpenDialog("none");
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "16px",
        left: "64px",
        display: "flex",
        alignItems: "center",
        height: "36px",
      }}
    >
      {props.chat.project != null && (
        <Fragment>
          <Link to={`/projects/${props.chat.project.id}`}>
            <Text
              sx={{
                maxWidth: { xs: "100px", sm: "200px", md: "300px" },
                "&:hover": { color: "secondary.main" },
              }}
              noWrap
            >
              {props.chat.project.title}
            </Text>
          </Link>
          <Text sx={{ marginInline: "8px" }}>/</Text>
        </Fragment>
      )}
      <Button
        sx={{
          maxWidth: { xs: "150px", sm: "300px", md: "500px" },
          padding: "0px",
          textTransform: "none",
          "&:hover": { color: "secondary.main", backgroundColor: "inherit" },
        }}
        endIcon={<ChevronDownIcon width="16px" height="16px" />}
        onClick={(event) => setAnchorElement(event?.currentTarget)}
      >
        <Text component="span" noWrap>
          {props.chat.title}
        </Text>
      </Button>
      <ChatMenu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorElement={anchorElement}
        onRename={() => {
          setAnchorElement(null);
          setOpenDialog("rename-chat");
        }}
        onDelete={() => {
          setAnchorElement(null);
          setOpenDialog("delete-chat");
        }}
        onClose={() => setAnchorElement(null)}
      />
      <RenameChatDialog
        isOpen={openDialog === "rename-chat"}
        title={props.chat.title}
        onRename={handleRenameChat}
        onCancel={() => setOpenDialog("none")}
      />
      <DeleteChatDialog
        isOpen={openDialog === "delete-chat"}
        onDelete={handleDeleteChat}
        onCancel={() => setOpenDialog("none")}
      />
    </Box>
  );
}
