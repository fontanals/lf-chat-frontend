import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { EditIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";

export type RenameChatDialogProps = {
  isOpen: boolean;
  title: string;
  onRename: (title: string) => void;
  onCancel: () => void;
};

export function RenameChatDialog(props: RenameChatDialogProps) {
  const [title, setTitle] = useState(props.title);

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onRename(title);
  }

  return (
    <Dialog
      slotProps={{ paper: { sx: { minWidth: "300px", borderRadius: "8px" } } }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        Rename Chat
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <form id="rename-chat-form" onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>
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
            color: "secondary.main",
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          }}
          type="submit"
          form="rename-chat-form"
        >
          <EditIcon size="16px" />
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}
