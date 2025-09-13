import { FormLabel, FormLabelProps } from "@mui/material";

export function Label(props: FormLabelProps) {
  const { sx, ...rest } = props;

  return (
    <FormLabel
      sx={{ fontSize: "14px", color: "text.primary", ...sx }}
      {...rest}
    />
  );
}
