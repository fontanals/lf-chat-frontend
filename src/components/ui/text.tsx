import { styled, Typography, TypographyProps } from "@mui/material";

export const Span = styled("span")({});

export function Text(props: TypographyProps) {
  const { variant, ...rest } = props;

  return <Typography variant={variant ?? "body2"} {...rest} />;
}
