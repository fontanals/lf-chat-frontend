import { alpha, Avatar, Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { Link } from "react-router";
import { services } from "../../services/provider";
import { Menu, MenuItem } from "../ui/menu";
import { Text } from "../ui/text";

export function SidebarUser() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
  });

  if (user == null) {
    return null;
  }

  return (
    <Fragment>
      <Button
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          width: "100%",
          minWidth: "100%",
          padding: "4px",
          textAlign: "start",
          textTransform: "none",
          overflowX: "hidden",
          borderRadius: "8px",
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
            borderRadius: "8px",
            backgroundColor: "secondary.main",
          }}
          variant="square"
        >
          L
        </Avatar>
        <Box sx={{ display: "grid", flex: 1 }}>
          <Text sx={{ lineHeight: 1 }} noWrap>
            {user.name}
          </Text>
          <Text
            sx={{ lineHeight: 1.1, color: "text.secondary" }}
            variant="caption"
            component="p"
            noWrap
          >
            {user.email}
          </Text>
        </Box>
        <ChevronsUpDownIcon style={{ marginRight: "4px" }} size="16px" />
      </Button>
      <Menu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement(null)}
      >
        <Link to="/profile" onClick={() => setAnchorElement(null)}>
          <MenuItem>
            <UserIcon size="16px" />
            Profile
          </MenuItem>
        </Link>
        <Link to="/profile/settings" onClick={() => setAnchorElement(null)}>
          <MenuItem>
            <SettingsIcon size="16px" />
            Settings
          </MenuItem>
        </Link>
        <MenuItem>
          <LogOutIcon size="16px" />
          Log out
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
