import { Box, List, ListItemButton } from "@mui/material";
import {
  MonitorCheckIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../state/theme";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export function SettingsTab() {
  const { t, i18n } = useTranslation();

  const { theme, setTheme } = useThemeStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "32px",
        }}
      >
        <SettingsIcon size="20px" />
        <Text variant="body1">{t("settings")}</Text>
      </Box>
      <Box>
        <Text>{t("theme")}</Text>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Tooltip title={t("light")} placement="top">
            <IconButton
              sx={{
                color: theme === "light" ? "secondary.main" : "text.primary",
              }}
              onClick={() => setTheme("light")}
            >
              <SunIcon size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("dark")} placement="top">
            <IconButton
              sx={{
                color: theme === "dark" ? "secondary.main" : "text.primary",
              }}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("match_system")} placement="top">
            <IconButton
              sx={{
                color: theme === "system" ? "secondary.main" : "text.primary",
              }}
              onClick={() => setTheme("system")}
            >
              <MonitorCheckIcon size="20px" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box>
        <Text>{t("language")}</Text>
        <List
          sx={{ display: "flex", gap: "16px", margin: "0px", padding: "0px" }}
        >
          <ListItemButton
            sx={{
              maxWidth: "fit-content",
              height: "40px",
              padding: "0px",
              fontSize: "14px",
              color: i18n.language === "en" ? "secondary.main" : "text.primary",
            }}
            disableRipple
            onClick={() => i18n.changeLanguage("en")}
          >
            {t("english")}
          </ListItemButton>
          <ListItemButton
            sx={{
              maxWidth: "fit-content",
              height: "40px",
              padding: "0px",
              fontSize: "14px",
              color: i18n.language === "pt" ? "secondary.main" : "text.primary",
            }}
            disableRipple
            onClick={() => i18n.changeLanguage("pt")}
          >
            {t("portuguese")}
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}
