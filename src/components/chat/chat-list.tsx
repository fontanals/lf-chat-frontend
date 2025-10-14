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
    <Link to={`/chats/${props.chat.id}`} onClick={props.onSelectChat}>
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px",
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": { backgroundColor: "background.default" },
          ...props.sx,
        }}
      >
        <Text noWrap>{props.chat.title}</Text>
        <IconButton
          sx={{ color: "primary.main", "&:hover": { color: "primary.main" } }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(event.currentTarget);
          }}
        >
          <EllipsisVerticalIcon size="16px" />
        </IconButton>
        <ChatMenu
          anchorElement={anchorElement}
          onRenameChat={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
            props.onRenameChat();
          }}
          onDeleteChat={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
            props.onRenameChat();
          }}
          onClose={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
          }}
        />
      </ListItem>
    </Link>
  );
}

export function ChatList(props: ListProps) {
  const { sx, ...rest } = props;

  return <List sx={{ margin: "0px", padding: "0px", ...sx }} {...rest} />;
}
