import {
  alpha,
  Avatar,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useSignout } from "../../hooks/auth";
import { useUser } from "../../hooks/user";
import { services } from "../../services/provider";
import { useSidebarStore } from "../../state/sidebar";
import { Menu, MenuItem } from "../ui/menu";
import { Text } from "../ui/text";

export function SidebarUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const { data: user } = useUser();
  const { mutate: signout } = useSignout();

  function handleLinkClick() {
    setAnchorElement(null);

    if (isMobile) {
      setIsOpen(false);
    }
  }

  function handleSignout() {
    setAnchorElement(null);

    services.httpClient.removeHeader("Authorization");
    queryClient.clear();

    navigate("/signin");

    signout();
  }

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
        aria-label={t("profile.menu.profile")}
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
          {user.name[0].toUpperCase()}
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
        <MenuItem>
          <Link
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            to="/profile"
            onClick={handleLinkClick}
          >
            <UserIcon size="16px" />
            {t("profile.menu_item.profile")}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            to="/profile/settings"
            onClick={handleLinkClick}
          >
            <SettingsIcon size="16px" />
            {t("profile.menu_item.settings")}
          </Link>
        </MenuItem>
        <MenuItem onClick={handleSignout}>
          <LogOutIcon size="16px" />
          {t("profile.menu_item.signout")}
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
