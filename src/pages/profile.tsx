import { Box } from "@mui/material";
import { useParams } from "react-router";
import { ContentPanel } from "../components/layout/content-panel";
import { ProfileTab } from "../components/profile/profile-tab";
import { SettingsTab } from "../components/profile/settings-tab";
import { Tabs } from "../components/ui/tabs";
import { useUser } from "../hooks/user";

export function ProfilePage() {
  const { tab = "profile" } = useParams();

  const { data: user } = useUser();

  return (
    <ContentPanel>
      <Box sx={{ display: "flex", justifyContent: "center", padding: "48px" }}>
        <Box sx={{ width: "100%", maxWidth: "800px" }}>
          <Tabs
            tabs={[
              { href: "/profile", value: "profile", label: "Profile" },
              {
                href: "/profile/settings",
                value: "settings",
                label: "Settings",
              },
            ]}
            selectedTab={tab}
          />
          {user != null && tab === "profile" && <ProfileTab user={user} />}
          {user != null && tab === "settings" && <SettingsTab />}
        </Box>
      </Box>
    </ContentPanel>
  );
}
