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

export function ShadowButton(props: ButtonProps & { primary?: boolean }) {
  const { sx, primary, ...rest } = props;

  return (
    <Button
      sx={{
        gap: "8px",
        fontSize: "14px",
        textTransform: "none",
        borderRadius: "8px",
        color: primary ? "primary.main" : "secondary.main",
        backgroundColor: (theme) =>
          primary
            ? alpha(theme.palette.primary.main, 0.1)
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
