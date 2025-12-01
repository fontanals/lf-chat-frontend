import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
} from "@mui/material";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useErrorStore } from "../../state/error";
import { ApplicationErrorCode } from "../../utils/errors";
import { ShadowButton } from "../ui/button";
import { Link } from "../ui/link";
import { Text } from "../ui/text";

export function ErrorDialog() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { showError, error, clearError } = useErrorStore();

  useEffect(() => {
    if (showError && error?.code === ApplicationErrorCode.Unauthorized) {
      navigate("/signin");
      clearError();
    }

    if (showError && error?.code === ApplicationErrorCode.SessionExpired) {
      navigate("/signin");
    }
  }, [showError, error, navigate, clearError]);

  function getErrorKey() {
    switch (error?.code) {
      case ApplicationErrorCode.SessionExpired:
        return "auth.error.session_expired";
      case ApplicationErrorCode.MaxUserDocumentsReached:
        return "profile.error.max_documents";
      case ApplicationErrorCode.ContentFilter:
        return "common.error.content_filter";
      default:
        return "common.error.try_again";
    }
  }

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
      open={showError && error?.code !== ApplicationErrorCode.Unauthorized}
      onClose={clearError}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("common.title.error")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>
          <Trans
            i18nKey={getErrorKey()}
            components={{
              Link: <Link to="/#" />,
            }}
          />
        </Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton onClick={clearError}>
          {t("common.button.ok")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
