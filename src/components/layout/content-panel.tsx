import { Box } from "@mui/material";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { useSidebarStore } from "../../state/sidebar";
import { IconButton } from "../ui/button";

export function ContentPanel(props: PropsWithChildren) {
  const { isOpen, setIsOpen } = useSidebarStore();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100dvh",
        marginLeft: { xs: "0px", sm: isOpen ? "256px" : "72px" },
        paddingTop: "64px",
        paddingBottom: "32px",
        paddingInline: { xs: "16px", sm: "32px", md: "64px" },
        backgroundColor: "background.paper",
        borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
        transition: (theme) =>
          theme.transitions.create("margin", {
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
          width: "36px",
          height: "36px",
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
