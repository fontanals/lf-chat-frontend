import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  alpha,
} from "@mui/material";
import { LockIcon, SaveIcon, UserIcon } from "lucide-react";
import { Input } from "../ui/input";

export function SecurityTab() {
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
        <LockIcon size="20px" />
        <Typography variant="body1">Change Password</Typography>
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
              htmlFor="password"
            >
              Current Password
            </FormLabel>
            <Input id="password" placeholder="Current Password" />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "14px", color: "text.primary" }}
              htmlFor="new-password"
            >
              New Password
            </FormLabel>
            <Input id="new-password" placeholder="New Password" />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "14px", color: "text.primary" }}
              htmlFor="confirm-password"
            >
              Confirm Password
            </FormLabel>
            <Input id="confirm-password" placeholder="Confirm Password" />
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
