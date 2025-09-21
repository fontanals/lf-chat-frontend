import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { EditIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";

export type RenameChatDialogProps = {
  isOpen: boolean;
  title: string;
  onRename: (title: string) => void;
  onCancel: () => void;
};

export function RenameChatDialog(props: RenameChatDialogProps) {
  const { t } = useTranslation();

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
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("rename_chat")}
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
        <ShadowButton primary onClick={props.onCancel}>
          {t("cancel")}
        </ShadowButton>
        <ShadowButton type="submit" form="rename-chat-form">
          <EditIcon size="16px" />
          {t("rename")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
