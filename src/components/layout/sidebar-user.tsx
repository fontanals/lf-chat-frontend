import { alpha, Avatar, Box, Button, Typography } from "@mui/material";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { Menu, MenuItem } from "../ui/menu";

export function SidebarUser() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <Fragment>
      <Button
        sx={{
          width: "100%",
          minWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "start",
          gap: "8px",
          padding: "4px",
          borderRadius: "8px",
          overflowX: "hidden",
          textTransform: "none",
          "&:hover": {
            color: "secondary.main",
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          },
        }}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <Avatar
          sx={{
            width: "32px",
            height: "32px",
            fontWeight: "bold",
            color: "background.default",
            backgroundColor: "secondary.main",
            borderRadius: "8px",
          }}
          variant="square"
        >
          L
        </Avatar>
        <Box sx={{ display: "grid", flex: 1 }}>
          <Typography sx={{ lineHeight: 1 }} variant="body2" noWrap>
            Lucas Fontana
          </Typography>
          <Typography
            sx={{ lineHeight: 1.1, color: "text.secondary" }}
            variant="caption"
            component="p"
            noWrap
          >
            fontana_ls@outlook.com
          </Typography>
        </Box>
        <ChevronsUpDownIcon width="16px" height="16px" />
      </Button>
      <Menu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement(null)}
      >
        <MenuItem>
          <UserIcon size="16px" />
          Profile
        </MenuItem>
        <MenuItem>
          <SettingsIcon size="16px" />
          Settings
        </MenuItem>
        <MenuItem>
          <LogOutIcon size="16px" />
          Log out
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
