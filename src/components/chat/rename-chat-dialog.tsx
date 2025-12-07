import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { PencilIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InfoAlert } from "../ui/alert";
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
              alpha(theme.palette.secondary.main, 0.2),
          },
        },
      }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("chat.title.rename_chat")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <form id="rename-chat-form" onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <InfoAlert>{t("common.text.input_notice")}</InfoAlert>
            <Input
              placeholder={t("chat.placeholder.chat_title")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton color="primary" onClick={props.onCancel}>
          {t("chat.button.cancel")}
        </ShadowButton>
        <ShadowButton type="submit" form="rename-chat-form">
          <PencilIcon size="16px" />
          {t("chat.button.rename")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
