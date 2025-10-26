import { Box, SxProps } from "@mui/material";
import { Link } from "react-router";
import { Text } from "../ui/text";

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
          <Text
            sx={{
              padding: "6px 8px",
              fontSize: "14px",
              borderRadius: "8px",
              backgroundColor:
                tab.value === props.selectedTab
                  ? "background.paper"
                  : "inherit",
            }}
          >
            {tab.label}
          </Text>
        </Link>
      ))}
    </Box>
  );
}
