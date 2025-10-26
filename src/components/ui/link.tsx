import { alpha, useTheme } from "@mui/material";
import { LinkProps, Link as RRLink } from "react-router";

export function Link(props: LinkProps) {
  const { style, ...rest } = props;

  const theme = useTheme();

  return (
    <RRLink
      style={{ color: theme.palette.secondary.main, ...style }}
      {...rest}
    />
  );
}

export function LinkButton(props: LinkProps) {
  const theme = useTheme();

  return (
    <RRLink
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        padding: "6px 8px",
        color: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
        borderRadius: "8px",
      }}
      to={props.to}
    >
      {props.children}
    </RRLink>
  );
}
