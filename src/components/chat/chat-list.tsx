import { List, ListItem, ListProps, SxProps } from "@mui/material";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Chat } from "../../models/entities/chat";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { ChatMenu } from "./chat-menu";

export type ChatListItemProps = {
  sx?: SxProps;
  chat: Chat;
  onSelectChat?: () => void;
  onRenameChat: () => void;
  onDeleteChat: () => void;
};

export function ChatListItem(props: ChatListItemProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        borderRadius: "8px",
        textTransform: "none",
        "&:hover": { backgroundColor: "background.default" },
        ...props.sx,
      }}
    >
      <Link
        style={{ width: "100%", overflow: "hidden" }}
        to={`/chats/${props.chat.id}`}
        onClick={props.onSelectChat}
      >
        <Text noWrap>{props.chat.title}</Text>
      </Link>
      <IconButton
        sx={{ color: "primary.main", "&:hover": { color: "primary.main" } }}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <EllipsisVerticalIcon size="16px" />
      </IconButton>
      <ChatMenu
        anchorElement={anchorElement}
        onRenameChat={() => {
          setAnchorElement(null);
          props.onRenameChat();
        }}
        onDeleteChat={() => {
          setAnchorElement(null);
          props.onRenameChat();
        }}
        onClose={() => setAnchorElement(null)}
      />
    </ListItem>
  );
}

export function ChatList(props: ListProps) {
  const { sx, ...rest } = props;

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        margin: "0px",
        padding: "0px",
        ...sx,
      }}
      {...rest}
    />
  );
}
