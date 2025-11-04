import { Box, Button } from "@mui/material";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Link } from "react-router";
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
    </Box>
  );
}
