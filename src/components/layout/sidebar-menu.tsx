import {
  alpha,
  Box,
  List,
  ListItemButton,
  ListProps,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router";

export type SidebarMenuItemProps = {
  href: string;
  icon: ReactNode;
  text: string;
};

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  return (
    <Link to={props.href}>
      <ListItemButton
        sx={{
          width: "100%",
          height: "36px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px",
          textWrap: "nowrap",
          overflow: "hidden",
          borderRadius: "8px",
          "&:hover": {
            color: "secondary.main",
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "32px",
            minHeight: "32px",
          }}
        >
          {props.icon}
        </Box>
        <Typography variant="body2">{props.text}</Typography>
      </ListItemButton>
    </Link>
  );
}

export function SidebarMenu(props: ListProps) {
  const { sx, ...rest } = props;

  return <List sx={{ margin: "0px", padding: "0px", ...sx }} {...rest} />;
}
