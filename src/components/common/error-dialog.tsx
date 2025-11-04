import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useErrorStore } from "../../state/error";
import { ApplicationErrorCode } from "../../utils/errors";
import { ShadowButton } from "../ui/button";
import { Text } from "../ui/text";

export function ErrorDialog() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { showError, error, clearError } = useErrorStore();

  useEffect(() => {
    if (error?.code === ApplicationErrorCode.Unauthorized) {
      navigate("/signin");
    }
  }, [error]);

  function getErrorMessage() {
    switch (error?.code) {
      case ApplicationErrorCode.Unauthorized:
        return t("session_expired_error_message");
      case ApplicationErrorCode.MaxUsersReached:
        return t("max_users_reached_error_message");
      case ApplicationErrorCode.MaxUserDocumentsReached:
        return t("max_user_documents_reached_error_message");
      default:
        return t("error_message");
    }
  }

  return (
    <Dialog
      slotProps={{
        paper: { sx: { borderRadius: "16px" } },
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.3),
          },
        },
      }}
      open={showError}
      onClose={clearError}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("error")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>{getErrorMessage()}</Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton onClick={clearError}>{t("ok")}</ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
