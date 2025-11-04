import { Box, alpha } from "@mui/material";
import { FileIcon, XIcon } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export type DocumentIndicatorProps = {
  document: { id: string; name: string };
  onRemoveDocument?: MouseEventHandler<HTMLButtonElement>;
  disableRemove?: boolean;
};

export function DocumentIndicator(props: DocumentIndicatorProps) {
  const { t } = useTranslation();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        alignItems: "center",
        gap: "4px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!props.disableRemove && isHovered && (
        <Tooltip title={t("remove_document")} variant="error">
          <IconButton
            sx={{
              position: "absolute",
              top: "-12px",
              right: "0px",
              width: "18px",
              height: "18px",
              color: "error.main",
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
              "&:hover": {
                color: "error.main",
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.2),
              },
            }}
            onClick={props.onRemoveDocument}
          >
            <Box
              sx={{
                display: "flex",
                aligntItems: "center",
                justifyContent: "center",
              }}
            >
              <XIcon size="12px" />
            </Box>
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <FileIcon size="16px" />
      </Box>
      <Text noWrap>{props.document.name}</Text>
    </Box>
  );
}
