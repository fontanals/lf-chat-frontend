import { alpha, Box, List, ListItemButton, ListProps } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router";
import { Text } from "../ui/text";

export type SidebarMenuItemProps = {
  href: string;
  text: string;
  tooltip: string;
  icon: ReactNode;
};

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  return (
    <Link to={props.href}>
      <ListItemButton
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          height: "36px",
          padding: "4px",
          whiteSpace: "nowrap",
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
        <Text>{props.text}</Text>
      </ListItemButton>
    </Link>
  );
}

export function SidebarMenu(props: ListProps) {
  const { sx, ...rest } = props;

  return <List sx={{ margin: "0px", padding: "0px", ...sx }} {...rest} />;
}
