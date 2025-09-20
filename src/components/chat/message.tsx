import { alpha, Box } from "@mui/material";
import { Message } from "../../models/entities/message";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { Text } from "../ui/text";

export type MessageProps = {
  message: Message;
};

export function UserMessage(props: MessageProps) {
  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        width: "fit-content",
        padding: "12px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        borderRadius: "16px 0px 16px 16px",
      }}
    >
      <Text>{props.message.content}</Text>
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
