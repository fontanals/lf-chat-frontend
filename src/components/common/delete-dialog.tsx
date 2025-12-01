import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ShadowButton } from "../ui/button";
import { Text } from "../ui/text";

export type DeleteDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteDialog(props: DeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      slotProps={{
        paper: { sx: { borderRadius: "16px" } },
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          },
        },
      }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body2">
        {props.title}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>{props.message}</Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton color="primary" onClick={props.onCancel}>
          {t("common.button.cancel")}
        </ShadowButton>
        <ShadowButton color="error" onClick={props.onDelete}>
          <Trash2Icon size="16px" />
          {t("common.button.delete")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
