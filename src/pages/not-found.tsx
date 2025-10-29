import { Box } from "@mui/material";
import { HouseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LinkButton } from "../components/ui/link";
import { Text } from "../components/ui/text";

export function NotFoundPage() {
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
        height: "100vh",
      }}
      component="main"
    >
      <Text variant="h5">{t("page_not_found")}</Text>
      <Text variant="h6">{t("page_not_found_message")}</Text>
      <LinkButton to="/">
        <HouseIcon size="16px" />
        {t("go_back_to_homepage")}
      </LinkButton>
    </Box>
  );
}
