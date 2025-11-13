import { alpha, Box } from "@mui/material";
import {
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import {
  Fragment,
  memo,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import {
  AssistantMessage,
  Message,
  MessageFeedback,
  UserContentBlock,
  UserMessage as UserMessageComponentº,
} from "../../models/entities/message";
import { StringUtils } from "../../utils/strings";
import { DocumentIndicator } from "../document/document-indicator";
import { IconButton, ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";
import StreamingIndicator from "./streaming-indicator";
import { ToolCallIndicator } from "./tool-call-indicator";

export type ContinueMessageProps = {
  onAccept: MouseEventHandler<HTMLButtonElement>;
  onDismiss: MouseEventHandler<HTMLButtonElement>;
};

export function ContinueMessage(props: ContinueMessageProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      <Box
        sx={{
          width: "fit-content",
          padding: "12px",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          borderRadius: "16px 0px 16px 16px",
        }}
      >
        <Text sx={{ whiteSpace: "pre" }}>{t("continue")}</Text>
      </Box>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <ShadowButton size="small" color="primary" onClick={props.onDismiss}>
          {t("dismiss")}
        </ShadowButton>
        <ShadowButton size="small" onClick={props.onAccept}>
          {t("accept")}
        </ShadowButton>
      </Box>
    </Box>
  );
}

export function UserMessageComponent(props: {
  message: UserMessageComponentº;
  onEditMessage: (
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) => void;
  additionalActions?: ReactNode;
}) {
  const { t } = useTranslation();

  const [textContent, setTextContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const textContentBlock = props.message.content.find(
      (contentBlock) => contentBlock.type === "text"
    );

    setTextContent(textContentBlock?.text ?? "");
  }, [props.message.content]);

  function handleEdit(event: React.FormEvent) {
    event.preventDefault();
    setIsEditing(false);

    if (!StringUtils.isNullOrWhitespace(textContent)) {
      const messageContent: UserContentBlock[] = props.message.content.filter(
        (contentBlock) => contentBlock.type !== "text"
      );

      messageContent.push({ type: "text", id: uuid(), text: textContent });

      props.onEditMessage(messageContent, props.message.parentMessageId);
    } else {
      const textContentBlock = props.message.content.find(
        (contentBlock) => contentBlock.type === "text"
      );

      setTextContent(textContentBlock?.text ?? "");
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);

    const textContentBlock = props.message.content.find(
      (contentBlock) => contentBlock.type === "text"
    );

    setTextContent(textContentBlock?.text ?? "");
  }

  const hasDocuments = props.message.content.some(
    (contentBlock) => contentBlock.type === "document"
  );

  if (isEditing) {
    return (
      <form onSubmit={handleEdit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <Input
            sx={{ width: "100%", height: "44px" }}
            autoFocus
            multiline
            maxRows={3}
            value={textContent}
            onChange={(event) => setTextContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleEdit(event);
              }
            }}
          />
          <Box sx={{ display: "flex", gap: "8px" }}>
            <ShadowButton
              type="button"
              color="primary"
              onClick={handleCancelEdit}
            >
              Cancel
            </ShadowButton>
            <ShadowButton type="submit">
              <PencilIcon size="16px" />
              Edit
            </ShadowButton>
          </Box>
        </Box>
      </form>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {hasDocuments && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {props.message.content
            .filter((contentBlock) => contentBlock.type === "document")
            .map((contentBlock) => (
              <DocumentIndicator
                key={contentBlock.id}
                document={contentBlock}
                disableRemove
              />
            ))}
        </Box>
      )}
      <Box
        sx={{
          width: "fit-content",
          padding: "12px",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          borderRadius: "16px 0px 16px 16px",
        }}
      >
        <Text sx={{ whiteSpace: "pre" }}>{textContent}</Text>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={t("copy")}>
          <IconButton
            onClick={() => navigator.clipboard.writeText(textContent)}
          >
            <CopyIcon size="16px" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("edit")}>
          <IconButton onClick={() => setIsEditing(true)}>
            <PencilIcon size="16px" />
          </IconButton>
        </Tooltip>
        {props.additionalActions}
      </Box>
    </Box>
  );
}

export function AssistantMessageComponent(props: {
  message: AssistantMessage;
  onChangeMessageFeedback?: (
    messageId: string,
    feedback: MessageFeedback | null
  ) => void;
  isStreaming?: boolean;
}) {
  const { t } = useTranslation();

  function handleCopy() {
    const textContent = props.message.content
      .filter((contentBlock) => contentBlock.type === "text")
      .map((contentBlock) => contentBlock.text)
      .join("\n");

    navigator.clipboard.writeText(textContent);
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
          backgroundColor: "error.main",
          borderRadius: "8px",
        }}
      >
        <AlertCircleIcon size="16px" />
        <Text>
          {props.message.finishReason === "content-filter"
            ? t("assistant_content_filter_message")
            : t("assistant_error_message")}
        </Text>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {props.message.content.map((contentBlock, index) => {
        switch (contentBlock.type) {
          case "text":
            return <MarkdownRenderer key={index} content={contentBlock.text} />;
          case "tool-call":
            return (
              <ToolCallIndicator key={index} contentBlock={contentBlock} />
            );
        }
      })}
      {props.message.finishReason === "interrupted" && (
        <Text sx={{ color: "text.secondary" }} variant="caption">
          {t("message_interrupted_by_user")}
        </Text>
      )}
      {(props.message.finishReason === "length" ||
        props.message.finishReason === "tool-calls") && (
        <Text sx={{ color: "text.secondary" }} variant="caption">
          {t("message_interrupted_due_to_size_constraints")}
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
          <Tooltip title={t("copy")}>
            <IconButton onClick={handleCopy}>
              <CopyIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("dislike")}>
            <IconButton
              sx={{
                color:
                  props.message.feedback === "dislike"
                    ? "secondary.main"
                    : "primary.main",
              }}
              onClick={() =>
                props.onChangeMessageFeedback?.(
                  props.message.id,
                  props.message.feedback === "dislike" ? "neutral" : "like"
                )
              }
            >
              <ThumbsDownIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("like")}>
            <IconButton
              sx={{
                color:
                  props.message.feedback === "like"
                    ? "secondary.main"
                    : "primary.main",
              }}
              onClick={() =>
                props.onChangeMessageFeedback?.(
                  props.message.id,
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

export type ChatMessageProps = {
  messageIds: string[];
  message: Message;
  onSelectMessage: (messageId: string) => void;
  onEditMessage: (
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) => void;
  onChangeMessageFeedback: (
    messageId: string,
    feedback: MessageFeedback | null
  ) => void;
  isStreaming?: boolean;
};

export const ChatMessage = memo((props: ChatMessageProps) => {
  const messageIndex = props.messageIds.findIndex(
    (messageId) => messageId === props.message.id
  );

  if (props.message.role === "user") {
    return (
      <UserMessageComponent
        message={props.message}
        onEditMessage={props.onEditMessage}
        additionalActions={
          props.messageIds.length > 1 && (
            <Fragment>
              <IconButton
                onClick={() =>
                  props.onSelectMessage(props.messageIds[messageIndex - 1])
                }
                disabled={messageIndex <= 0}
              >
                <ChevronLeftIcon size="16px" />
              </IconButton>
              <Text>
                {messageIndex + 1}/{props.messageIds.length}
              </Text>
              <IconButton
                onClick={() =>
                  props.onSelectMessage(props.messageIds[messageIndex + 1])
                }
                disabled={messageIndex >= props.messageIds.length - 1}
              >
                <ChevronRightIcon size="16px" />
              </IconButton>
            </Fragment>
          )
        }
      />
    );
  }

  return (
    <AssistantMessageComponent
      message={props.message}
      onChangeMessageFeedback={props.onChangeMessageFeedback}
      isStreaming={props.isStreaming}
    />
  );
});
