import { Box, Button, SxProps } from "@mui/material";
import { Link } from "react-router";

export type Tab = { href: string; value: string; label: string };

export type TabsProps = {
  sx?: SxProps;
  tabs: Tab[];
  selectedTab: string;
};

export function Tabs(props: TabsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        width: "fit-content",
        padding: "4px",
        backgroundColor: "background.default",
        borderRadius: "8px",
        ...props.sx,
      }}
    >
      {props.tabs.map((tab) => (
        <Link key={tab.value} to={tab.href}>
          <Button
            sx={{
              padding: "4px",
              fontSize: "14px",
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor:
                tab.value === props.selectedTab ? "#0F172B" : "inherit",
            }}
            disableRipple
          >
            {tab.label}
          </Button>
        </Link>
      ))}
    </Box>
  );
}
