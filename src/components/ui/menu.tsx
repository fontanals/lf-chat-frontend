import {
  MenuItemProps,
  MenuProps,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  alpha,
} from "@mui/material";

export function Menu(props: MenuProps) {
  const { slotProps, ...rest } = props;

  return (
    <MuiMenu
      slotProps={{
        paper: { sx: { borderRadius: "8px" } },
        list: { sx: { minWidth: "120px", padding: "4px" } },
        ...slotProps,
      }}
      {...rest}
    />
  );
}

export function MenuItem(props: MenuItemProps) {
  const { sx, ...rest } = props;

  return (
    <MuiMenuItem
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "36px",
        fontSize: "14px",
        padding: "4px 8px",
        borderRadius: "8px",
        "&:hover": {
          color: "secondary.main",
          backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
        },
        ...sx,
      }}
      {...rest}
    />
  );
}
