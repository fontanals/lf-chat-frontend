import { Box, CircularProgress } from "@mui/material";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ProcessDocumentToolCallContentBlock,
  ReadDocumentToolCallContentBlock,
} from "../../models/entities/message";
import { Text } from "../ui/text";

export type ProcessDocumentToolCallIndicatorProps = {
  contentBlock: ProcessDocumentToolCallContentBlock;
};

export function ProcessDocumentToolCallIndicator(
  props: ProcessDocumentToolCallIndicatorProps
) {
  const { t } = useTranslation();

  if (props.contentBlock.output == null) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          borderRadius: "8px",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={16} />
        <Text>
          {t("chat.message.processing_document", {
            name: props.contentBlock.input?.name ?? "",
          })}
        </Text>
      </Box>
    );
  }

  if (!props.contentBlock.output.success) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          color: "#F5F5F5",
          backgroundColor: "error.main",
        }}
      >
        <XIcon size="16px" />
        <Text>
          {t("chat.error.process_document", {
            name: props.contentBlock.input?.name ?? "",
          })}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 8px",
        borderRadius: "8px",
        color: "#F5F5F5",
        backgroundColor: "success.main",
      }}
    >
      <CheckIcon size="16px" />
      <Text>
        {t("chat.message.process_document", {
          name: props.contentBlock.input.name,
        })}
      </Text>
    </Box>
  );
}

export type ReadDocumentToolCallIndicatorProps = {
  contentBlock: ReadDocumentToolCallContentBlock;
};

export function ReadDocumentToolCallIndicator(
  props: ReadDocumentToolCallIndicatorProps
) {
  const { t } = useTranslation();

  if (props.contentBlock.output == null) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          borderRadius: "8px",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={16} />
        <Text>
          {t("chat.message.reading_document", {
            name: props.contentBlock.input?.name ?? "",
          })}
        </Text>
      </Box>
    );
  }

  if (!props.contentBlock.output.success) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          color: "#F5F5F5",
          backgroundColor: "error.main",
        }}
      >
        <XIcon size="16px" />
        <Text>
          {t("chat.error.read_document", {
            name: props.contentBlock.input?.name ?? "",
          })}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 8px",
        borderRadius: "8px",
        color: "#F5F5F5",
        backgroundColor: "success.main",
      }}
    >
      <CheckIcon size="16px" />
      <Text>
        {t("chat.message.read_document", {
          name: props.contentBlock.input.name,
        })}
      </Text>
    </Box>
  );
}
