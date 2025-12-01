import { Box } from "@mui/material";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { ShadowButton } from "../ui/button";
import { Text } from "../ui/text";

export type ContinueMessageProps = {
  onAccept: MouseEventHandler<HTMLButtonElement>;
  onDismiss: MouseEventHandler<HTMLButtonElement>;
};

export function ContinueMessage(props: ContinueMessageProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      <Box
        sx={{
          width: "fit-content",
          padding: "12px",
          backgroundColor: "background.default",
          borderRadius: "16px 0px 16px 16px",
        }}
      >
        <Text sx={{ whiteSpace: "pre-wrap" }}>{t("chat.text.continue")}</Text>
      </Box>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <ShadowButton size="small" color="primary" onClick={props.onDismiss}>
          {t("chat.button.dismiss")}
        </ShadowButton>
        <ShadowButton size="small" onClick={props.onAccept}>
          {t("chat.button.accept")}
        </ShadowButton>
      </Box>
    </Box>
  );
}
