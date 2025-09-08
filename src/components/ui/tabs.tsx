import { Box, Button, SxProps } from "@mui/material";

export type Tab = { value: string; label: string };

export type TabsProps = {
  sx?: SxProps;
  tabs: Tab[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
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
        <Button
          key={tab.value}
          sx={{
            padding: "4px",
            fontSize: "14px",
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor:
              tab.value === props.selectedTab ? "#0F172B" : "inherit",
          }}
          disableRipple
          onClick={() => props.onSelectTab(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
}
