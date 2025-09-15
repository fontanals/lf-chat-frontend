import { IconButton, List, ListItem, ListProps, SxProps } from "@mui/material";
import { EllipsisVerticalIcon } from "lucide-react";
import { MouseEventHandler } from "react";
import { Chat } from "../../models/entities/chat";
import { Text } from "../ui/text";

export type ChatListItemProps = {
  sx?: SxProps;
  chat: Chat;
  onMenuClick?: MouseEventHandler<HTMLButtonElement>;
};

export function ChatListItem(props: ChatListItemProps) {
  return (
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
        sx={{ color: "primary.main" }}
        size="small"
        onClick={props.onMenuClick}
      >
        <EllipsisVerticalIcon size="16px" />
      </IconButton>
    </ListItem>
  );
}

export function ChatList(props: ListProps) {
  const { sx, ...rest } = props;

  return <List sx={{ margin: "0px", padding: "0px", ...sx }} {...rest} />;
}
