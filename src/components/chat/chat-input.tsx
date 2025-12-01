import { Box, IconButton, InputBase, SxProps, alpha } from "@mui/material";
import { ArrowUpRightIcon, CircleStopIcon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { useUploadDocuments } from "../../hooks/document";
import { UserContentBlock } from "../../models/entities/message";
import { useAlertStore } from "../../state/alert";
import { ArrayUtils } from "../../utils/arrays";
import { allowedFileTypes } from "../../utils/constants";
import { StringUtils } from "../../utils/strings";
import { DocumentIndicator } from "../document/document-indicator";
import { Tooltip } from "../ui/tooltip";

export type ChatInputProps = {
  containerSx?: SxProps;
  placeholder: string;
  isStreaming: boolean;
  onSendMessage: (content: UserContentBlock[]) => void;
  onStopStream: () => void;
};

export function ChatInput(props: ChatInputProps) {
  const { t } = useTranslation();

  const displayAlert = useAlertStore((state) => state.displayAlert);

  const [message, setMessage] = useState("");

  const { uploadMap, uploadDocument, deleteDocument, clearUploadMap } =
    useUploadDocuments();

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files.some((file) => !allowedFileTypes.includes(file.type))) {
        displayAlert({
          severity: "error",
          message: t("chat.error.invalid_document_type"),
        });

        return;
      }

      files.forEach((file) =>
        uploadDocument({ request: { id: uuid(), file } })
      );
    },
    noClick: true,
  });

  function handleSendMessage() {
    if (
      StringUtils.isNullOrWhitespace(message) &&
      ArrayUtils.isNullOrEmpty(Object.keys(uploadMap))
    ) {
      return;
    }

    const contentBlocks: UserContentBlock[] = [];

    Object.values(uploadMap).forEach((item) => {
      contentBlocks.push({ type: "document", id: item.id, name: item.name });
    });

    contentBlocks.push({ type: "text", id: uuid(), text: message });

    props.onSendMessage(contentBlocks);

    setMessage("");
    clearUploadMap();
  }

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        padding: "16px",
        borderRadius: "16px",
        backgroundColor: "background.default",
        ...(isDragActive
          ? {
              border: (theme) => `1px dashed ${theme.palette.secondary.main}`,
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),
            }
          : undefined),
        ...props.containerSx,
      }}
    >
      <InputBase
        sx={{ fontSize: "14px" }}
        aria-label={t("chat.label.write_to_assistant")}
        autoFocus
        placeholder={props.placeholder}
        fullWidth
        multiline
        maxRows={5}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Tooltip title={t("chat.label.attach_document")}>
          <IconButton
            sx={{
              width: "32px",
              height: "32px",
              minWidth: "32px",
              minHeight: "32px",
              padding: "0px",
              color: "primary.main",
              backgroundColor: "transparent",
              "&:hover": {
                color: "secondary.main",
                backgroundColor: "transparent",
              },
            }}
            aria-label={t("chat.label.attach_document")}
            onClick={open}
          >
            <PaperclipIcon size="20px" />
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1, display: "flex", gap: "8px" }}>
          {Object.values(uploadMap).map((item) => (
            <DocumentIndicator
              key={item.id}
              document={item}
              onRemoveDocument={() =>
                deleteDocument({ params: { documentId: item.id } })
              }
            />
          ))}
        </Box>
        <IconButton
          sx={{
            width: "32px",
            height: "32px",
            minWidth: "32px",
            minHeight: "32px",
            padding: "0px",
            color: "background.default",
            borderRadius: "8px",
            backgroundColor: "secondary.main",
            "&:hover": { backgroundColor: "secondary.main" },
            "&:disabled": {
              backgroundColor: "secondary.main",
              color: "background.default",
              opacity: 0.5,
            },
            "& .MuiTouchRipple-child": { borderRadius: "8px" },
          }}
          aria-label={
            props.isStreaming
              ? t("chat.label.stop_response")
              : t("chat.label.send_message")
          }
          onClick={props.isStreaming ? props.onStopStream : handleSendMessage}
          disabled={
            !props.isStreaming &&
            ((StringUtils.isNullOrWhitespace(message) &&
              ArrayUtils.isNullOrEmpty(Object.values(uploadMap))) ||
              Object.values(uploadMap).some(
                (item) => item.status === "uploading"
              ))
          }
        >
          {props.isStreaming ? (
            <CircleStopIcon size="24px" />
          ) : (
            <ArrowUpRightIcon size="24px" />
          )}
        </IconButton>
      </Box>
      <input {...getInputProps()} />
    </Box>
  );
}
