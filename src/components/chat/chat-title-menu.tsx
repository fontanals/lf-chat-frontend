import { Button } from "@mui/material";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Chat } from "../../models/entities/chat";
import { Text } from "../ui/text";
import { ChatMenu } from "./chat-menu";

export type ChatTitleMenuProps = {
  chat: Chat;
  onRenameChat: () => void;
  onDeleteChat: () => void;
};

export function ChatTitleMenu(props: ChatTitleMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <Fragment>
      {props.chat.project != null && <Text>{props.chat.project.title} / </Text>}
      <Button
        sx={{
          height: "36px",
          textTransform: "none",
          borderRadius: "8px",
          backgroundColor: "#0F172B",
          "&:hover": { color: "secondary.main", backgroundColor: "#0F172B" },
        }}
        disableRipple
        endIcon={<ChevronDownIcon width="16px" height="16px" />}
        onClick={(event) => setAnchorElement(event?.currentTarget)}
      >
        {props.chat.title}
      </Button>
      <ChatMenu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorElement={anchorElement}
        onRenameChat={() => {
          setAnchorElement(null);
          props.onRenameChat();
        }}
        onDeleteChat={() => {
          setAnchorElement(null);
          props.onDeleteChat();
        }}
        onClose={() => setAnchorElement(null)}
      />
    </Fragment>
  );
}
