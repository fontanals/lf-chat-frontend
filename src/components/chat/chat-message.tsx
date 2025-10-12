import { alpha, Box } from "@mui/material";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Fragment, memo, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AssistantMessage,
  Message,
  UserContentPart,
  UserMessage as UserMessageComponentº,
} from "../../models/entities/message";
import { ArrayUtils } from "../../utils/arrays";
import { StringUtils } from "../../utils/strings";
import { DocumentIndicator } from "../document/document-indicator";
import { IconButton, ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

function UserMessageComponent(props: {
  message: UserMessageComponentº;
  onEditMessage: (
    content: UserContentPart[],
    parentMessageId?: string | null
  ) => void;
  additionalActions?: ReactNode;
}) {
  const { t } = useTranslation();

  const [textContent, setTextContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const textPart = props.message.content.find(
      (contentPart) => contentPart.type === "text"
    );

    setTextContent(textPart?.text ?? "");
  }, [props.message.content]);

  function handleEdit(event: React.FormEvent) {
    event.preventDefault();
    setIsEditing(false);

    if (!StringUtils.isNullOrWhitespace(textContent)) {
      const messageContent: UserContentPart[] = props.message.content.filter(
        (contentPart) => contentPart.type !== "text"
      );

      messageContent.push({ type: "text", text: textContent });

      props.onEditMessage(messageContent, props.message.parentMessageId);
    } else {
      const textPart = props.message.content.find(
        (contentPart) => contentPart.type === "text"
      );

      setTextContent(textPart?.text ?? "");
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);

    const textPart = props.message.content.find(
      (contentPart) => contentPart.type === "text"
    );

    setTextContent(textPart?.text ?? "");
  }

  const hasDocuments = props.message.content.some(
    (contentPart) => contentPart.type === "document"
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
            sx={{ height: "44px" }}
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
            <ShadowButton type="button" primary onClick={handleCancelEdit}>
              <PencilIcon size="16px" />
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
            .filter((contentPart) => contentPart.type === "document")
            .map((contentPart) => (
              <DocumentIndicator
                key={contentPart.id}
                document={contentPart}
                removeDisabled
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
        <Text>{textContent}</Text>
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
  hideActions?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
    >
      <Box sx={{ width: "100%", paddingInline: "12px", fontSize: "14px" }}>
        {props.message.content.map((contentPart, index) => (
          <MarkdownRenderer key={index} content={contentPart.text} />
        ))}
      </Box>
      {!props.hideActions && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={t("copy")}>
            <IconButton onClick={() => {}}>
              <CopyIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("dislike")}>
            <IconButton onClick={() => {}}>
              <ThumbsDownIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("like")}>
            <IconButton onClick={() => {}}>
              <ThumbsUpIcon size="16px" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

export type ChatMessageProps = {
  activePath: string[];
  messageIds: string[];
  messages: Record<string, Message>;
  onSelectMessage: (messageId: string) => void;
  onEditMessage: (
    content: UserContentPart[],
    parentMessageId?: string | null
  ) => void;
};

export const ChatMessage = memo((props: ChatMessageProps) => {
  const selectedMessageIndex = props.messageIds.findIndex((messageId) =>
    props.activePath.includes(messageId)
  );
  const selectedMessageId = props.messageIds[selectedMessageIndex];
  const selectedMessage = props.messages[selectedMessageId] as
    | Message
    | undefined;

  if (selectedMessage == null) {
    return null;
  }

  return (
    <Fragment>
      {selectedMessage.role === "user" ? (
        <UserMessageComponent
          message={selectedMessage}
          onEditMessage={props.onEditMessage}
          additionalActions={
            props.messageIds.length > 1 && (
              <Fragment>
                <IconButton
                  onClick={() =>
                    props.onSelectMessage(
                      props.messageIds[selectedMessageIndex - 1]
                    )
                  }
                  disabled={selectedMessageIndex <= 0}
                >
                  <ChevronLeftIcon size="16px" />
                </IconButton>
                <Text>
                  {selectedMessageIndex + 1}/{props.messageIds.length}
                </Text>
                <IconButton
                  onClick={() =>
                    props.onSelectMessage(
                      props.messageIds[selectedMessageIndex + 1]
                    )
                  }
                  disabled={selectedMessageIndex >= props.messageIds.length - 1}
                >
                  <ChevronRightIcon size="16px" />
                </IconButton>
              </Fragment>
            )
          }
        />
      ) : (
        <AssistantMessageComponent message={selectedMessage} />
      )}
      {!ArrayUtils.isNullOrEmpty(selectedMessage.childrenMessageIds) && (
        <ChatMessage
          activePath={props.activePath}
          messageIds={selectedMessage.childrenMessageIds!}
          messages={props.messages}
          onSelectMessage={props.onSelectMessage}
          onEditMessage={props.onEditMessage}
        />
      )}
    </Fragment>
  );
});
