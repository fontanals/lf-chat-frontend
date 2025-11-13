import {
  Avatar,
  Box,
  Drawer,
  DrawerProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FolderClosedIcon,
  MessageCircleMoreIcon,
  MessageCirclePlusIcon,
} from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useSidebarStore } from "../../state/sidebar";
import { PreviousChats } from "../chat/previous-chats";
import { Text } from "../ui/text";
import { SidebarMenu, SidebarMenuItem } from "./sidebar-menu";
import { SidebarUser } from "./sidebar-user";

function DesktopDrawer(props: DrawerProps) {
  const { slotProps, ...rest } = props;

  return (
    <Drawer
      sx={{ width: props.open ? "256px" : "72px" }}
      slotProps={{
        paper: {
          sx: {
            width: props.open ? "256px" : "72px",
            padding: "16px",
            border: "none",
            overflow: "hidden",
            backgroundColor: "background.default",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: props.open
                  ? theme.transitions.duration.leavingScreen
                  : theme.transitions.duration.enteringScreen,
              }),
          },
        },
      }}
      variant="permanent"
      open
      {...rest}
    />
  );
}

function MobileDrawer(props: DrawerProps) {
  const { slotProps, ...rest } = props;

  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
            width: "256px",
            padding: "16px",
            border: "none",
            backgroundColor: "background.default",
          },
        },
      }}
      {...rest}
    />
  );
}

export function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isOpen, setIsOpen } = useSidebarStore();

  const content = (
    <Fragment>
      <Link to="/">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
            paddingInline: "4px",
            textWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          <Avatar
            sx={{
              width: "32px",
              height: "36px",
              fontWeight: "bold",
              color: "secondary.main",
              backgroundColor: "background.default",
            }}
          >
            LF
          </Avatar>
          <Box>
            <Text sx={{ fontWeight: "bold", lineHeight: 1 }} variant="body1">
              LF CHAT
            </Text>
            <Text
              sx={{ lineHeight: 1, color: "text.secondary" }}
              variant="caption"
              component="p"
            >
              Free
            </Text>
          </Box>
        </Box>
      </Link>
      <SidebarMenu sx={{ marginTop: "16px" }}>
        <SidebarMenuItem
          href="/new"
          text={t("new_chat")}
          icon={<MessageCirclePlusIcon size="24px" />}
          hideTooltip={isOpen}
          onClick={() => {
            if (isMobile) {
              setIsOpen(false);
            }
          }}
        />
        <SidebarMenuItem
          active={location.pathname === "/history"}
          href="/history"
          text={t("chat_history")}
          icon={<MessageCircleMoreIcon size="24px" />}
          hideTooltip={isOpen}
          onClick={() => {
            if (isMobile) {
              setIsOpen(false);
            }
          }}
        />
        <SidebarMenuItem
          active={location.pathname === "/projects"}
          href="/projects"
          text={t("projects")}
          icon={<FolderClosedIcon size="24px" />}
          hideTooltip={isOpen}
          onClick={() => {
            if (isMobile) {
              setIsOpen(false);
            }
          }}
        />
      </SidebarMenu>
      <PreviousChats />
      <SidebarUser />
    </Fragment>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={isOpen} onClose={() => setIsOpen(false)}>
        {content}
      </MobileDrawer>
    );
  }

  return <DesktopDrawer open={isOpen}>{content}</DesktopDrawer>;
}
