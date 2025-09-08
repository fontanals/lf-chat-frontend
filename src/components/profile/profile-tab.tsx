import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  alpha,
} from "@mui/material";
import { SaveIcon, UserIcon } from "lucide-react";
import { Input } from "../ui/input";

export function ProfileTab() {
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
        <UserIcon size="20px" />
        <Typography variant="body1">Profile</Typography>
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
              htmlFor="name"
            >
              Name
            </FormLabel>
            <Input id="name" placeholder="Name" />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "14px", color: "text.primary" }}
              htmlFor="email"
            >
              Email
            </FormLabel>
            <Input id="email" placeholder="Email" />
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
