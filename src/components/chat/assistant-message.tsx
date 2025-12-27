import { Box } from "@mui/material";
import {
  AlertCircleIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { useUpdateMessage } from "../../hooks/chat";
import {
  AssistantMessage,
  MessageFeedback,
} from "../../models/entities/message";
import { IconButton } from "../ui/button";
import { Link } from "../ui/link";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";
import StreamingIndicator from "./streaming-indicator";
import {
  ProcessDocumentToolCallIndicator,
  ReadDocumentToolCallIndicator,
} from "./tool-call-indicator";

export type AssistantMessageComponentProps = {
  message: AssistantMessage;
  isStreaming?: boolean;
};

export function AssistantMessageComponent(
  props: AssistantMessageComponentProps
) {
  const { t } = useTranslation();

  const { mutate: updateMessage } = useUpdateMessage();

  function handleCopy() {
    const textContent = props.message.content
      .filter((contentBlock) => contentBlock.type === "text")
      .map((contentBlock) => contentBlock.text)
      .join("\n");

    navigator.clipboard.writeText(textContent);
  }

  function handleFeedback(feedback: MessageFeedback) {
    updateMessage({
      params: { chatId: props.message.chatId, messageId: props.message.id },
      request: { feedback },
    });
  }

  if (
    ["error", "content-filter", "other", "unknown"].includes(
      props.message.finishReason
    )
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px",
          color: "#F5F5F5",
          backgroundColor: "error.main",
          borderRadius: "8px",
        }}
      >
        <AlertCircleIcon size="16px" />
        <Text>
          <Trans
            i18nKey={
              props.message.finishReason === "content-filter"
                ? "chat.message.assistant_content_filter"
                : "chat.error.assistant_message"
            }
            components={{ Link: <Link color="#F5F5F5" to="/term-of-use" /> }}
          />
        </Text>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
      data-role="assistant"
    >
      {props.message.content.map((contentBlock) => {
        switch (contentBlock.type) {
          case "text":
            return (
              <MarkdownRenderer
                key={contentBlock.id}
                content={contentBlock.text}
              />
            );
          case "tool-call":
            return contentBlock.name === "processDocument" ? (
              <ProcessDocumentToolCallIndicator
                key={contentBlock.id}
                contentBlock={contentBlock}
              />
            ) : (
              <ReadDocumentToolCallIndicator
                key={contentBlock.id}
                contentBlock={contentBlock}
              />
            );
        }
      })}
      {props.message.finishReason === "interrupted" && (
        <Text sx={{ color: "text.secondary" }} variant="caption">
          {t("chat.message.interrupted_by_user")}
        </Text>
      )}
      {(props.message.finishReason === "length" ||
        props.message.finishReason === "tool-calls") && (
        <Text sx={{ color: "text.secondary" }} variant="caption">
          {t("chat.message.interrupted_by_size")}
        </Text>
      )}
      {props.isStreaming ? (
        <StreamingIndicator />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title={t("chat.tooltip.copy")}>
            <IconButton onClick={handleCopy}>
              <CopyIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("chat.tooltip.dislike")}>
            <IconButton
              active={props.message.feedback === "dislike"}
              onClick={() =>
                handleFeedback(
                  props.message.feedback === "dislike" ? "neutral" : "dislike"
                )
              }
            >
              <ThumbsDownIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("chat.tooltip.like")}>
            <IconButton
              active={props.message.feedback === "like"}
              onClick={() =>
                handleFeedback(
                  props.message.feedback === "like" ? "neutral" : "like"
                )
              }
            >
              <ThumbsUpIcon size="16px" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
