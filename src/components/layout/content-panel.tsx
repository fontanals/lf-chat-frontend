import { Box, IconButton, useTheme } from "@mui/material";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { useSidebarStore } from "../../state/sidebar";

export function ContentPanel(props: PropsWithChildren) {
  const theme = useTheme();

  const { isOpen, setIsOpen } = useSidebarStore();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 32px)",
        marginTop: "16px",
        marginBottom: "16px",
        marginRight: "16px",
        marginLeft: { xs: "16px", sm: isOpen ? "256px" : "72px" },
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "background.paper",
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: isOpen
            ? theme.transitions.duration.leavingScreen
            : theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: "16px",
          left: "16px",
          color: "primary.main",
          "&:hover": { color: "secondary.main" },
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <PanelLeftCloseIcon size="20px" />
        ) : (
          <PanelLeftOpenIcon size="20px" />
        )}
      </IconButton>
      {props.children}
    </Box>
  );
}
