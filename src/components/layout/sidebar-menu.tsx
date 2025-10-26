import { alpha, Box, List, ListItem, ListProps } from "@mui/material";
import { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";
import { Text } from "../ui/text";
import { Tooltip } from "../ui/tooltip";

export type SidebarMenuItemProps = {
  active?: boolean;
  href: string;
  text: string;
  icon: ReactNode;
  hideTooltip?: boolean;
  onClick?: MouseEventHandler<HTMLLIElement>;
};

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  return (
    <Tooltip
      title={props.hideTooltip ? "" : props.text}
      placement="right-start"
    >
      <ListItem
        sx={{
          width: "100%",
          height: "36px",
          padding: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          borderRadius: "8px",
          color: props.active ? "secondary.main" : "text.primary",
          backgroundColor: props.active
            ? (theme) => alpha(theme.palette.secondary.main, 0.2)
            : "inherit",
          "&:hover": {
            color: "secondary.main",
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          },
        }}
        onClick={props.onClick}
      >
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
          to={props.href}
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
          <Text noWrap>{props.text}</Text>
        </Link>
      </ListItem>
    </Tooltip>
  );
}

export function SidebarMenu(props: ListProps) {
  const { sx, ...rest } = props;

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        margin: "0px",
        padding: "0px",
        ...sx,
      }}
      {...rest}
    />
  );
}
