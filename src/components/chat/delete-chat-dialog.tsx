import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { Trash2Icon } from "lucide-react";
import { ShadowButton } from "../ui/button";
import { Text } from "../ui/text";

export type DeleteChatDialogProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteChatDialog(props: DeleteChatDialogProps) {
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
        Delete Chat
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>Are you sure you want to delete this chat?</Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton primary onClick={props.onCancel}>
          Cancel
        </ShadowButton>
        <ShadowButton
          sx={{
            color: "error.main",
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
          }}
          onClick={props.onDelete}
        >
          <Trash2Icon size="16px" />
          Delete
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
