import { useTheme } from "@mui/material";
import { LinkProps, Link as RRLink } from "react-router";

export function Link(props: LinkProps) {
  const { style, ...rest } = props;

  const theme = useTheme();

  return (
    <RRLink style={{ color: theme.palette.primary.main, ...style }} {...rest} />
  );
}
