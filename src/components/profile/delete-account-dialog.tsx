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

export type DeleteAccountDialogProps = {
  isOpen: boolean;
  onDeleteAccount: () => void;
  onCancel: () => void;
};

export function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      slotProps={{
        paper: {
          sx: { minWidth: "300px", borderRadius: "16px" },
        },
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.3),
          },
        },
      }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body2">
        {t("delete_account")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>{t("are_you_sure_you_want_to_delete_your_account")}</Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton color="primary" onClick={props.onCancel}>
          {t("cancel")}
        </ShadowButton>
        <ShadowButton color="error" onClick={props.onDeleteAccount}>
          <Trash2Icon size="16px" />
          {t("delete")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
