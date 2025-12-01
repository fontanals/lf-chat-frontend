import { Box, List, ListItem, ListItemButton } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginTop: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <SettingsIcon size="20px" />
        <Text variant="body1">{t("profile.title.settings")}</Text>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Text>{t("profile.title.theme")}</Text>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Tooltip title={t("profile.tooltip.light")}>
            <IconButton
              sx={{
                color: theme === "light" ? "secondary.main" : "text.primary",
              }}
              onClick={() => setTheme("light")}
            >
              <SunIcon size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("profile.tooltip.dark")}>
            <IconButton
              sx={{
                color: theme === "dark" ? "secondary.main" : "text.primary",
              }}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("profile.tooltip.match_system")}>
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Text>{t("profile.title.language")}</Text>
        <List
          sx={{ display: "flex", gap: "16px", margin: "0px", padding: "0px" }}
        >
          <ListItem sx={{ maxWidth: "fit-content", padding: "0px" }}>
            <ListItemButton
              sx={{
                padding: "8px 0px",
                fontSize: "14px",
                color:
                  i18n.language === "en" ? "secondary.main" : "text.primary",
              }}
              disableRipple
              onClick={() => i18n.changeLanguage("en")}
            >
              {t("profile.button.english")}
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ maxWidth: "fit-content", padding: "0px" }}>
            <ListItemButton
              sx={{
                padding: "8px 0px",
                fontSize: "14px",
                color:
                  i18n.language === "pt" ? "secondary.main" : "text.primary",
              }}
              disableRipple
              onClick={() => i18n.changeLanguage("pt")}
            >
              {t("profile.button.portuguese")}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
