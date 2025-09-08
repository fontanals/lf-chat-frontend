import { Button } from "@mui/material";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { StringUtils } from "../../utils/strings";
import { ChatMenu } from "./chat-menu";

export type ChatTitleMenuProps = {
  title: string;
  onRename: () => void;
  onDelete: () => void;
};

export function ChatTitleMenu(props: ChatTitleMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  if (StringUtils.isNullOrWhitespace(props.title)) {
    return null;
  }

  return (
    <Fragment>
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
        {props.title}
      </Button>
      <ChatMenu
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        anchorElement={anchorElement}
        onRename={() => {
          setAnchorElement(null);
          props.onRename();
        }}
        onDelete={() => {
          setAnchorElement(null);
          props.onDelete();
        }}
        onClose={() => setAnchorElement(null)}
      />
    </Fragment>
  );
}
