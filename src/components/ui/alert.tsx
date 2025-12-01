import { AlertProps, Alert as MuiAlert, alpha } from "@mui/material";

export function InfoAlert(props: AlertProps) {
  const { sx, variant, ...rest } = props;

  return (
    <MuiAlert
      sx={{
        alignItems: "center",
        width: "100%",
        color: variant === "filled" ? "primary.main" : "secondary.main",
        backgroundColor:
          variant === "filled"
            ? "secondary.main"
            : (theme) => alpha(theme.palette.secondary.main, 0.2),
        borderRadius: "8px",
        "& .MuiAlert-icon": { color: "secondary.main" },
        ...sx,
      }}
      severity="info"
      {...rest}
    />
  );
}

export function SuccessAlert(props: AlertProps) {
  const { sx, variant, ...rest } = props;

  return (
    <MuiAlert
      sx={{
        alignItems: "center",
        width: "100%",
        color: variant === "filled" ? "primary.main" : "success.main",
        backgroundColor:
          variant === "filled"
            ? "success.main"
            : (theme) => alpha(theme.palette.success.main, 0.2),
        borderRadius: "8px",
        ...sx,
      }}
      severity="success"
      {...rest}
    />
  );
}

export function ErrorAlert(props: AlertProps) {
  const { sx, variant, ...rest } = props;

  return (
    <MuiAlert
      sx={{
        alignItems: "center",
        width: "100%",
        color: variant === "filled" ? "primary.main" : "error.main",
        backgroundColor:
          variant === "filled"
            ? "error.main"
            : (theme) => alpha(theme.palette.error.main, 0.2),
        borderRadius: "8px",
        ...sx,
      }}
      severity="error"
      {...rest}
    />
  );
}
