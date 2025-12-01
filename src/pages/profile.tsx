import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { ContentPanel } from "../components/layout/content-panel";
import { AccountTab } from "../components/profile/account-tab";
import { DataTab } from "../components/profile/data-tab";
import { ProfileTab } from "../components/profile/profile-tab";
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
            {
              href: "/profile",
              value: "profile",
              label: t("profile.title.profile"),
            },
            {
              href: "/profile/settings",
              value: "settings",
              label: t("profile.title.settings"),
            },
            {
              href: "/profile/data",
              value: "data",
              label: t("profile.title.data"),
            },
            {
              href: "/profile/account",
              value: "account",
              label: t("profile.title.account"),
            },
          ]}
          selectedTab={tab}
        />
      </Box>
      {user != null && tab === "profile" && <ProfileTab user={user} />}
      {user != null && tab === "settings" && <SettingsTab />}
      {user != null && tab === "data" && <DataTab />}
      {user != null && tab === "account" && <AccountTab />}
    </ContentPanel>
  );
}
