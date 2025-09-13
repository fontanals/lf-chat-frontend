import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ContentPanel } from "../components/layout/content-panel";
import { ProfileTab } from "../components/profile/profile-tab";
import { SettingsTab } from "../components/profile/settings-tab";
import { Tabs } from "../components/ui/tabs";
import { services } from "../services/provider";

export function Profile() {
  const { tab = "profile" } = useParams();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
  });

  return (
    <ContentPanel>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "800px", padding: "32px" }}>
          <Tabs
            sx={{ marginTop: "36px" }}
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
