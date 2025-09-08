import { InputProps, InputBase, alpha } from "@mui/material";

export function Input(props: InputProps) {
  const { sx, ...rest } = props;

  return (
    <InputBase
      sx={{
        width: "100%",
        fontSize: "14px",
        paddingInline: "8px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        borderRadius: "8px",
        ...sx,
      }}
      inputProps={{ sx: { height: "32px", padding: "4px" } }}
      {...rest}
    />
  );
}
