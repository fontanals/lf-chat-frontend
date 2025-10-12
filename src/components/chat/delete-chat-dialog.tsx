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

export type DeleteChatDialogProps = {
  isOpen: boolean;
  onDeleteChat: () => void;
  onCancel: () => void;
};

export function DeleteChatDialog(props: DeleteChatDialogProps) {
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
        {t("delete_chat")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>{t("are_you_sure_you_want_to_delete_this_chat")}</Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton primary onClick={props.onCancel}>
          {t("cancel")}
        </ShadowButton>
        <ShadowButton
          sx={{
            color: "error.main",
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
          }}
          onClick={props.onDeleteChat}
        >
          <Trash2Icon size="16px" />
          {t("delete")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
