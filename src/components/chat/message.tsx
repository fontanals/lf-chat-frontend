import { Box, Typography } from "@mui/material";
import { Message } from "../../models/entities/message";
import { MarkdownRenderer } from "../ui/markdown-renderer";

export type MessageProps = {
  message: Message;
};

export function UserMessage(props: MessageProps) {
  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        width: "fit-content",
        padding: "16px",
        backgroundColor: "background.default",
        borderRadius: "16px 0px 16px 16px",
      }}
    >
      <Typography variant="body2">{props.message.content}</Typography>
    </Box>
  );
}

export function AssistantMessage(props: MessageProps) {
  return (
    <Box sx={{ width: "fit-content", paddingInline: "16px", fontSize: "14px" }}>
      <MarkdownRenderer content={props.message.content} />
    </Box>
  );
}
