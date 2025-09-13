import { Box, IconButton, List, ListItemButton } from "@mui/material";
import {
  MonitorCheckIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useState } from "react";
import { Text } from "../ui/text";

export function SettingsTab() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState<"en" | "pt">("en");

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
        <Text variant="body1">Settings</Text>
      </Box>
      <Box>
        <Text>Theme</Text>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <IconButton
            sx={{
              color: theme === "light" ? "secondary.main" : "text.primary",
            }}
            onClick={() => setTheme("light")}
          >
            <SunIcon size="20px" />
          </IconButton>
          <IconButton
            sx={{ color: theme === "dark" ? "secondary.main" : "text.primary" }}
            onClick={() => setTheme("dark")}
          >
            <MoonIcon size="20px" />
          </IconButton>
          <IconButton
            sx={{
              color: theme === "system" ? "secondary.main" : "text.primary",
            }}
            onClick={() => setTheme("system")}
          >
            <MonitorCheckIcon size="20px" />
          </IconButton>
        </Box>
      </Box>
      <Box>
        <Text>Language</Text>
        <List
          sx={{ display: "flex", gap: "16px", margin: "0px", padding: "0px" }}
        >
          <ListItemButton
            sx={{
              maxWidth: "fit-content",
              height: "40px",
              padding: "0px",
              fontSize: "14px",
              color: language === "en" ? "secondary.main" : "text.primary",
            }}
            disableRipple
            onClick={() => setLanguage("en")}
          >
            English
          </ListItemButton>
          <ListItemButton
            sx={{
              maxWidth: "fit-content",
              height: "40px",
              padding: "0px",
              fontSize: "14px",
              color: language === "pt" ? "secondary.main" : "text.primary",
            }}
            disableRipple
            onClick={() => setLanguage("pt")}
          >
            Portuguese
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}
