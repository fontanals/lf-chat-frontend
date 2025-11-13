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
            ? alpha(theme.palette.primary.main, 0.1)
            : color === "error"
            ? alpha(theme.palette.error.main, 0.2)
            : alpha(theme.palette.secondary.main, 0.2),

        ...sx,
      }}
      {...rest}
    />
  );
}

export function IconButton(props: IconButtonProps) {
  const { sx, size, ...rest } = props;

  return (
    <MuiIconButton
      sx={{
        color: "primary.main",
        "&:hover": { color: "secondary.main" },
        "&.Mui-disabled": {
          color: (theme) => alpha(theme.palette.primary.main, 0.3),
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
