import { Box } from "@mui/material";
import { AlertCircleIcon, CopyIcon, PencilIcon } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { UserContentBlock, UserMessage } from "../../models/entities/message";
import { StringUtils } from "../../utils/strings";
import { DocumentIndicator } from "../document/document-indicator";
import { IconButton, ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "../ui/link";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export type UserMessageComponentProps = {
  message: UserMessage;
  additionalActions?: ReactNode;
  onEdit: (
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) => void;
};

export function UserMessageComponent(props: UserMessageComponentProps) {
  const { t } = useTranslation();

  const [textContent, setTextContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const textContentBlock = props.message.content.find(
      (contentBlock) => contentBlock.type === "text"
    );

    setTextContent(textContentBlock?.text ?? "");
  }, [props.message.content]);

  function handleEdit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsEditing(false);

    if (!StringUtils.isNullOrWhitespace(textContent)) {
      const contentBlocks: UserContentBlock[] = props.message.content.filter(
        (contentBlock) => contentBlock.type !== "text"
      );

      contentBlocks.push({ type: "text", id: uuid(), text: textContent });

      props.onEdit(contentBlocks, props.message.parentMessageId);
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

  if (props.message.finishReason === "content-filter") {
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
            i18nKey="chat.message.user_content_filter"
            components={{
              Link: <Link color="#F5F5F5" to="/terms-of-use" />,
            }}
          />
        </Text>
      </Box>
    );
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
            sx={{ width: "100%", height: "44px" }}
            placeholder={t("chat.placeholder.edit_message")}
            autoFocus
            multiline
            maxRows={3}
            value={textContent}
            onChange={(event) => setTextContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleEdit();
              }
            }}
          />
          <Box sx={{ display: "flex", gap: "8px" }}>
            <ShadowButton
              type="button"
              color="primary"
              onClick={handleCancelEdit}
            >
              {t("chat.button.cancel")}
            </ShadowButton>
            <ShadowButton type="submit">
              <PencilIcon size="16px" />
              {t("chat.button.edit")}
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
      data-role="user"
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
          backgroundColor: "background.default",
          borderRadius: "16px 0px 16px 16px",
        }}
      >
        <Text sx={{ whiteSpace: "pre-wrap" }}>{textContent}</Text>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={t("chat.tooltip.copy")}>
          <IconButton
            onClick={() => navigator.clipboard.writeText(textContent)}
          >
            <CopyIcon size="16px" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("chat.tooltip.edit")}>
          <IconButton
            aria-label={t("chat.label.edit_message")}
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon size="16px" />
          </IconButton>
        </Tooltip>
        {props.additionalActions}
      </Box>
    </Box>
  );
}
