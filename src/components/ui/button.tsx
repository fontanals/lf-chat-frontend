import { ButtonProps, Button as MuiButton } from "@mui/material";

export function Button(props: ButtonProps) {
  const { sx, ...rest } = props;

  return (
    <MuiButton
      sx={{
        fontSize: "16px",
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
