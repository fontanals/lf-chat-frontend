import { alpha, Box } from "@mui/material";
import { FileIcon, FilePlus2Icon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { useUploadDocuments } from "../../hooks/document";
import { Project } from "../../models/entities/project";
import { useAlertStore } from "../../state/alert";
import { ArrayUtils } from "../../utils/arrays";
import { allowedFileTypes } from "../../utils/constants";
import { DocumentIndicator } from "../document/document-indicator";
import { IconButton, TextButton } from "../ui/button";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export type ProjectDocumentsProps = {
  project: Project;
};

export function ProjectDocuments(props: ProjectDocumentsProps) {
  const { t } = useTranslation();

  const displayAlert = useAlertStore((state) => state.displayAlert);

  const { uploadMap, uploadDocument, deleteDocument } = useUploadDocuments(
    props.project.id
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files.some((file) => !allowedFileTypes.includes(file.type))) {
        displayAlert({
          severity: "error",
          message: t("project.error.invalid_document_type"),
        });

        return;
      }

      files.forEach((file) =>
        uploadDocument({
          request: { id: uuid(), file, projectId: props.project.id },
        })
      );
    },
    noClick: true,
  });

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginTop: "8px",
        paddingBlock: "8px",
        ...(isDragActive
          ? {
              borderRadius: "16px",
              border: (theme) => `1px dashed ${theme.palette.secondary.main}`,
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
          {t("project.text.drop_files")}
        </Text>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text sx={{ paddingInline: "16px", color: "text.secondary" }}>
          {t("project.title.documents")}
        </Text>

        <Tooltip title={t("project.tooltip.add_document")}>
          <IconButton
            aria-label={t("project.label.add_document")}
            onClick={open}
          >
            <FilePlus2Icon size="16px" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          alginItems: "center",
          gap: "8px",
          padding: "8px 16px",
        }}
      >
        {ArrayUtils.isNullOrEmpty(props.project.documents) ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box>
              <FileIcon size="16px" />
            </Box>
            <Text>{t("project.text.no_documents")}</Text>
            <TextButton>{t("project.text.add_documents")}</TextButton>
          </Box>
        ) : (
          props.project.documents!.map((document) => (
            <DocumentIndicator
              key={document.id}
              document={{ ...document, status: uploadMap[document.id]?.status }}
              onRemoveDocument={() =>
                deleteDocument({ params: { documentId: document.id } })
              }
            />
          ))
        )}
      </Box>
    </Box>
  );
}
