import {
  Tooltip as MuiTooltip,
  styled,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";

export const Tooltip = styled(
  ({ className, color, ...props }: TooltipProps & { variant?: "error" }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
  )
)(({ theme, variant }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.background.paper,
    backgroundColor:
      variant === "error"
        ? theme.palette.error.main
        : theme.palette.secondary.main,
  },
}));
