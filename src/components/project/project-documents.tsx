import { alpha, Box } from "@mui/material";
import { FilePlus2Icon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Project } from "../../models/entities/project";
import { ArrayUtils } from "../../utils/arrays";
import { DocumentIndicator } from "../document/document-indicator";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export type ProjectDocumentsProps = {
  project: Project;
  onAddDocument: (files?: File[]) => void;
  onRemoveDocument: (documentId: string) => void;
};

export function ProjectDocuments(props: ProjectDocumentsProps) {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: props.onAddDocument,
    noClick: true,
  });

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBlock: "8px",
        paddingInline: "16px",
        ...(isDragActive
          ? {
              borderRadius: "16px",
              border: (theme) =>
                `1px dashed ${alpha(theme.palette.secondary.main, 0.5)}`,
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),
            }
          : undefined),
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <Text
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "secondary.main",
          }}
        >
          {t("drag_and_drop_to_upload")}
        </Text>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text sx={{ color: "text.secondary" }}>{t("documents")}</Text>
        <Tooltip title={t("add_document")}>
          <IconButton onClick={open}>
            <FilePlus2Icon size="16px" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", alginItems: "center", gap: "8px" }}>
        {ArrayUtils.isNullOrEmpty(props.project.documents) ? (
          <Text variant="caption">
            {t("add_pdf_documents_as_context_to_the_project")}
          </Text>
        ) : (
          props.project.documents?.map((document) => (
            <DocumentIndicator
              key={document.id}
              document={document}
              onRemoveDocument={() => props.onRemoveDocument(document.id)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
