import { alpha, Box } from "@mui/material";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EditIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Fragment, memo, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "../../models/entities/message";
import { ArrayUtils } from "../../utils/arrays";
import { StringUtils } from "../../utils/strings";
import { IconButton, ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

function UserMessage(props: {
  message: Message;
  onEditMessage: (content: string, parentId?: string | null) => void;
  additionalActions?: ReactNode;
}) {
  const { t } = useTranslation();

  const [content, setContent] = useState(props.message.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(props.message.content);
  }, [props.message.content]);

  function handleEdit(event: React.FormEvent) {
    event.preventDefault();
    setIsEditing(false);

    if (!StringUtils.isNullOrWhitespace(content)) {
      props.onEditMessage(content, props.message.parentId);
    } else {
      setContent(props.message.content);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setContent(props.message.content);
  }

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
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleEdit(event);
              }
            }}
          />
          <Box sx={{ display: "flex", gap: "8px" }}>
            <ShadowButton type="button" primary onClick={handleCancelEdit}>
              <EditIcon size="16px" />
              Cancel
            </ShadowButton>
            <ShadowButton type="submit">
              <EditIcon size="16px" />
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
      <Box
        sx={{
          width: "fit-content",
          padding: "12px",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          borderRadius: "16px 0px 16px 16px",
        }}
      >
        <Text>{content}</Text>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={t("copy")}>
          <IconButton onClick={() => navigator.clipboard.writeText(content)}>
            <CopyIcon size="16px" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("edit")}>
          <IconButton onClick={() => setIsEditing(true)}>
            <EditIcon size="16px" />
          </IconButton>
        </Tooltip>
        {props.additionalActions}
      </Box>
    </Box>
  );
}

export function AssistantMessage(props: { message: Message }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
    >
      <Box sx={{ width: "100%", paddingInline: "12px", fontSize: "14px" }}>
        <MarkdownRenderer content={props.message.content} />
      </Box>
      {!props.message.isIncomplete && (
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
  onEditMessage: (content: string, parentId?: string | null) => void;
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
        <UserMessage
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
        <AssistantMessage message={selectedMessage} />
      )}
      {!ArrayUtils.isNullOrEmpty(selectedMessage.childrenIds) && (
        <ChatMessage
          activePath={props.activePath}
          messageIds={selectedMessage.childrenIds!}
          messages={props.messages}
          onSelectMessage={props.onSelectMessage}
          onEditMessage={props.onEditMessage}
        />
      )}
    </Fragment>
  );
});
