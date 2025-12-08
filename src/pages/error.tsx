import { Box } from "@mui/material";
import { HouseIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LinkButton } from "../components/ui/link";
import { Text } from "../components/ui/text";

export function ErrorPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        width: "100%",
        height: "100dvh",
      }}
      component="main"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TriangleAlertIcon size="24px" />
        <Text variant="h5">{t("common.title.error")}</Text>
      </Box>
      <Text variant="h6">{t("common.message.error_page")}</Text>
      <LinkButton to="/">
        <HouseIcon size="16px" />
        {t("common.button.back_homepage")}
      </LinkButton>
    </Box>
  );
}
