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

  const { error, setError } = useErrorStore();

  useEffect(() => {
    if (error?.code === ApplicationErrorCode.Unauthorized) {
      navigate("/signin");
    }
  }, [error]);

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
      open={error != null}
      onClose={() => setError(null)}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("error")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <Text>
          {error?.code === ApplicationErrorCode.Unauthorized
            ? t("session_expired_error_message")
            : t("error_message")}
        </Text>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton onClick={() => setError(null)}>{t("ok")}</ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
