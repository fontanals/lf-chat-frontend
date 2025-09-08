import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from "@mui/material";
import { Trash2Icon } from "lucide-react";

export type DeleteChatDialogProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteChatDialog(props: DeleteChatDialogProps) {
  return (
    <Dialog
      slotProps={{ paper: { sx: { minWidth: "300px", borderRadius: "8px" } } }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body2">
        Delete Chat
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Typography variant="body2">
          Are you sure you want to delete this chat?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <Button
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          }}
          onClick={props.onCancel}
        >
          Cancel
        </Button>
        <Button
          sx={{
            gap: "8px",
            fontSize: "14px",
            fontWeight: "400",
            textTransform: "none",
            borderRadius: "8px",
            color: "error.main",
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
          }}
          onClick={props.onDelete}
        >
          <Trash2Icon size="16px" />
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
