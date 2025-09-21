import {
  Tooltip as MuiTooltip,
  styled,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.secondary.main,
  },
}));
