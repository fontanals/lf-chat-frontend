import {
  alpha,
  Button,
  ButtonProps,
  IconButtonProps,
  IconButton as MuiIconButton,
} from "@mui/material";

export function ContainedButton(props: ButtonProps) {
  const { sx, ...rest } = props;

  return (
    <Button
      sx={{
        fontSize: "14px",
        fontWeight: "bold",
        textTransform: "none",
        color: "background.default",
        backgroundColor: "secondary.main",
        borderRadius: "8px",
        "&:hover": { backgroundColor: "secondary.main" },
        "&.Mui-disabled": {
          backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.3),
        },
        ...sx,
      }}
      {...rest}
    />
  );
}

export function ShadowButton(
  props: ButtonProps & { color?: "primary" | "secondary" | "error" }
) {
  const { sx, color, ...rest } = props;

  return (
    <Button
      sx={{
        gap: "8px",
        fontSize: "14px",
        textTransform: "none",
        borderRadius: "8px",
        color:
          color === "primary"
            ? "primary.main"
            : color === "error"
            ? "error.main"
            : "secondary.main",
        backgroundColor: (theme) =>
          color === "primary"
            ? "background.default"
            : color === "error"
            ? alpha(theme.palette.error.main, 0.2)
            : alpha(theme.palette.secondary.main, 0.2),
        "&.Mui-disabled": {
          color: (theme) =>
            color === "primary"
              ? alpha(theme.palette.primary.main, 0.5)
              : color === "error"
              ? alpha(theme.palette.error.main, 0.5)
              : alpha(theme.palette.secondary.main, 0.5),
          backgroundColor: (theme) =>
            color === "primary"
              ? "background.default"
              : color === "error"
              ? alpha(theme.palette.error.main, 0.1)
              : alpha(theme.palette.secondary.main, 0.1),
        },
        ...sx,
      }}
      {...rest}
    />
  );
}

export function IconButton(props: IconButtonProps & { active?: boolean }) {
  const { sx, active, size, ...rest } = props;

  return (
    <MuiIconButton
      sx={{
        color: active ? "secondary.main" : "primary.main",
        backgroundColor: "transparent",
        "&:hover": { color: "secondary.main", backgroundColor: "transparent" },
        "&.Mui-disabled": {
          color: (theme) => alpha(theme.palette.primary.main, 0.2),
        },
        ...sx,
      }}
      size={size ?? "small"}
      {...rest}
    />
  );
}

export function TextButton(props: ButtonProps) {
  const { sx, ...rest } = props;

  return (
    <Button
      sx={{
        padding: "0px",
        textTransform: "none",
        color: "secondary.main",
        backgroundColor: "inherit",
        "&:hover": { backgroundColor: "inherit" },
        ...sx,
      }}
      variant="text"
      disableRipple
      {...rest}
    />
  );
}
