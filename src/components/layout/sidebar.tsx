import { Avatar, Box, Drawer, Typography, useTheme } from "@mui/material";
import { MessageCircleMoreIcon, MessageCirclePlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useSidebarStore } from "../../state/sidebar";
import { ChatHistory } from "../chat/chat-history";
import { SidebarMenu, SidebarMenuItem } from "./sidebar-menu";
import { SidebarUser } from "./sidebar-user";

export function Sidebar() {
  const theme = useTheme();

  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <Drawer
      sx={{ width: isOpen ? "240px" : "56px" }}
      slotProps={{
        paper: {
          sx: {
            width: isOpen ? "240px" : "56px",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "16px",
            border: "none",
            overflow: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: isOpen
                ? theme.transitions.duration.leavingScreen
                : theme.transitions.duration.enteringScreen,
            }),
          },
        },
      }}
      variant="permanent"
      open
    >
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
              backgroundColor: "background.paper",
            }}
          >
            AI
          </Avatar>
          <Box>
            <Typography
              sx={{ fontWeight: "bold", lineHeight: 1 }}
              variant="body1"
            >
              AI-CHAT
            </Typography>
            <Typography
              sx={{ lineHeight: 1, color: "text.secondary" }}
              variant="caption"
              component="p"
            >
              Free
            </Typography>
          </Box>
        </Box>
      </Link>
      <SidebarMenu sx={{ marginTop: "16px" }}>
        <SidebarMenuItem
          href="/"
          text="New Chat"
          icon={<MessageCirclePlusIcon width="24px" height="24px" />}
        />
        <SidebarMenuItem
          href="/history"
          text="Chat History"
          icon={<MessageCircleMoreIcon width="24px" height="24px" />}
        />
      </SidebarMenu>
      <ChatHistory isOpen={isOpen} />
      <SidebarUser />
    </Drawer>
  );
}
