import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { ContentPanel } from "../components/layout/content-panel";
import { ProfileTab } from "../components/profile/profile-tab";
import { SecurityTab } from "../components/profile/security-tab";
import { SettingsTab } from "../components/profile/settings-tab";
import { Tabs } from "../components/ui/tabs";
import { useUser } from "../hooks/user";

export function ProfilePage() {
  const { tab = "profile" } = useParams();
  const { t } = useTranslation();

  const { data: user } = useUser();

  return (
    <ContentPanel>
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        <Tabs
          tabs={[
            { href: "/profile", value: "profile", label: t("profile") },
            {
              href: "/profile/security",
              value: "security",
              label: t("security"),
            },
            {
              href: "/profile/settings",
              value: "settings",
              label: t("settings"),
            },
          ]}
          selectedTab={tab}
        />
      </Box>
      {user != null && tab === "profile" && <ProfileTab user={user} />}
      {user != null && tab === "security" && <SecurityTab />}
      {user != null && tab === "settings" && <SettingsTab />}
    </ContentPanel>
  );
}
