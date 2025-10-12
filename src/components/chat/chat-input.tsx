import { Box, IconButton, InputBase, SxProps, alpha } from "@mui/material";
import { ArrowUpRightIcon, PaperclipIcon } from "lucide-react";
import { ChangeEventHandler } from "react";
import { useDropzone } from "react-dropzone";
import { UploadMap } from "../../hooks/document";
import { DocumentIndicator } from "../document/document-indicator";

export type ChatInputProps = {
  containerSx?: SxProps;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: () => void;
  uploadMap?: UploadMap;
  onAddDocuments?: (files: File[]) => void;
  onRemoveDocument?: (id: string) => void;
  disabled?: boolean;
};

export function ChatInput(props: ChatInputProps) {
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: props.onAddDocuments,
    noClick: true,
  });

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
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        ...(isDragActive
          ? {
              border: (theme) =>
                `1px dashed ${alpha(theme.palette.secondary.main, 0.5)}`,
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),
            }
          : undefined),
        ...props.containerSx,
      }}
    >
      <input {...getInputProps()} />
      <InputBase
        sx={{ fontSize: "14px" }}
        placeholder={props.placeholder}
        fullWidth
        multiline
        maxRows={5}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            props.onSubmit();
          }
        }}
      />
      <Box sx={{ display: "flex", gap: "8px" }}>
        <IconButton
          sx={{
            width: "32px",
            height: "32px",
            minWidth: "32px",
            minHeight: "32px",
            padding: "0px",
            color: "primary.main",
          }}
          onClick={open}
        >
          <PaperclipIcon size="20px" />
        </IconButton>
        <Box sx={{ flex: 1, display: "flex", gap: "8px" }}>
          {props.uploadMap != null &&
            Object.values(props.uploadMap).map((item) => (
              <DocumentIndicator
                key={item.id}
                document={item}
                onRemoveDocument={() => props.onRemoveDocument?.(item.id)}
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
          onClick={props.onSubmit}
          disabled={props.disabled}
        >
          <ArrowUpRightIcon size="24px" />
        </IconButton>
      </Box>
    </Box>
  );
}
