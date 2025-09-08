import { Box } from "@mui/material";
import { useState } from "react";
import { ContentPanel } from "../components/layout/content-panel";
import { ProfileTab } from "../components/profile/profile-tab";
import { SecurityTab } from "../components/profile/security-tab";
import { SettingsTab } from "../components/profile/settings-tab";
import { Tabs } from "../components/ui/tabs";

export function Profile() {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <ContentPanel>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "800px", padding: "32px" }}>
          <Tabs
            sx={{ marginTop: "36px" }}
            tabs={[
              { value: "profile", label: "Profile" },
              { value: "settings", label: "Settings" },
              { value: "security", label: "Security" },
            ]}
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
          />
          {selectedTab === "profile" && <ProfileTab />}
          {selectedTab === "settings" && <SettingsTab />}
          {selectedTab === "security" && <SecurityTab />}
        </Box>
      </Box>
    </ContentPanel>
  );
}
