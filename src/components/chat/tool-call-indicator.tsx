import { Box, CircularProgress } from "@mui/material";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ProcessDocumentToolCallContentBlock,
  SearchDocumentToolCallContentBlock,
  ToolCallContentBlock,
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
          {t("processing_document_name", {
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
          borderRadius: "8px",
          backgroundColor: "error.main",
        }}
      >
        <XIcon size="16px" />
        <Text>
          {t("failed_to_process_document_name", {
            name: props.contentBlock.input.name,
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
        backgroundColor: "success.main",
      }}
    >
      <CheckIcon size="16px" />
      <Text>
        {t("processed_document_name_successfully", {
          name: props.contentBlock.input.name,
        })}
      </Text>
    </Box>
  );
}

export type SearchDocumentToolCallIndicatorProps = {
  contentBlock: SearchDocumentToolCallContentBlock;
};

export function SearchDocumentToolCallIndicator(
  props: SearchDocumentToolCallIndicatorProps
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
          {t("reading_document_name", {
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
          borderRadius: "8px",
          backgroundColor: "error.main",
        }}
      >
        <XIcon size="16px" />
        <Text>
          {t("failed_to_read_document_name", {
            name: props.contentBlock.input.name,
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
        backgroundColor: "success.main",
      }}
    >
      <CheckIcon size="16px" />
      <Text>
        {t("read_document_name_successfully", {
          name: props.contentBlock.input.name,
        })}
      </Text>
    </Box>
  );
}

export type ToolCallIndicatorProps = {
  contentBlock: ToolCallContentBlock;
};

export function ToolCallIndicator(props: ToolCallIndicatorProps) {
  return props.contentBlock.name === "processDocument" ? (
    <ProcessDocumentToolCallIndicator contentBlock={props.contentBlock} />
  ) : (
    <SearchDocumentToolCallIndicator contentBlock={props.contentBlock} />
  );
}
