import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Typography,
  alpha,
} from "@mui/material";
import {
  MonitorCheckIcon,
  MoonIcon,
  SaveIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { Input } from "../ui/input";

export function SettingsTab() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "32px",
        }}
      >
        <SettingsIcon size="20px" />
        <Typography variant="body1">Settings</Typography>
      </Box>
      <Box sx={{ marginTop: "16px" }}>
        <Typography variant="body2">Theme</Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <IconButton sx={{ color: "primary.main" }}>
            <SunIcon size="20px" />
          </IconButton>
          <IconButton sx={{ color: "secondary.main" }}>
            <MoonIcon size="20px" />
          </IconButton>
          <IconButton sx={{ color: "primary.main" }}>
            <MonitorCheckIcon size="20px" />
          </IconButton>
        </Box>
      </Box>
      <form>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          <FormControl>
            <FormLabel
              sx={{ fontSize: "14px", color: "text.primary" }}
              htmlFor="display-name"
            >
              How the assistant should call you
            </FormLabel>
            <Input id="display-name" placeholder="Name" />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "14px", color: "text.primary" }}
              htmlFor="preferences"
            >
              Personal preferences to share with assistant
            </FormLabel>
            <Input id="preferences" placeholder="Name" multiline rows={3} />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
            }}
          >
            Cancel
          </Button>
          <Button
            sx={{
              gap: "8px",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
              borderRadius: "8px",
              color: "secondary.main",
              backgroundColor: (theme) =>
                alpha(theme.palette.secondary.main, 0.2),
            }}
          >
            <SaveIcon size="16px" />
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
}
