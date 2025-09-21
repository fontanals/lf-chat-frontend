import { InputBase, InputProps, alpha } from "@mui/material";

export function Input(props: InputProps) {
  const { sx, ...rest } = props;

  return (
    <InputBase
      sx={{
        width: "100%",
        fontSize: "14px",
        paddingInline: "8px",
        borderRadius: "8px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        "& .MuiInputBase-input": {
          color: "text.primary",
          "&::placeholder": {
            color: (theme) => alpha(theme.palette.text.primary, 0.5),
          },
          "&.Mui-disabled": {
            color: (theme) => alpha(theme.palette.text.primary, 0.2),
            "-webkit-text-fill-color": (theme) =>
              alpha(theme.palette.text.primary, 0.2),
            "&::placeholder": {
              color: (theme) => alpha(theme.palette.text.primary, 0.2),
              "-webkit-text-fill-color": (theme) =>
                alpha(theme.palette.text.primary, 0.2),
            },
          },
        },
        ...sx,
      }}
      inputProps={{ sx: { height: "32px", padding: "4px" } }}
      {...rest}
    />
  );
}
