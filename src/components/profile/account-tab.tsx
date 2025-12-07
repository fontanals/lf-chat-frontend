import { Box, Divider } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { CircleUserIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useDeleteUser } from "../../hooks/user";
import { services } from "../../services/provider";
import { ShadowButton } from "../ui/button";
import { LoadingBackdrop } from "../ui/loading-backdrop";
import { Text } from "../ui/text";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function AccountTab() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);

  const { mutate: deleteUser, isPending } = useDeleteUser();

  function handleDeleteAccount() {
    setIsDeleteAccountDialogOpen(false);

    deleteUser(undefined, {
      onSuccess: () => {
        services.httpClient.removeHeader("Authorization");
        queryClient.clear();

        navigate("/signin");
      },
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginTop: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <CircleUserIcon size="20px" />
        <Text variant="body1">{t("profile.title.account")}</Text>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Text>{t("profile.text.delete_account")}</Text>
        <ShadowButton
          color="error"
          onClick={() => setIsDeleteAccountDialogOpen(true)}
          disabled
        >
          <Trash2Icon size="16px" />
          {t("profile.button.delete_account")}
        </ShadowButton>
      </Box>
      <Divider />
      <DeleteAccountDialog
        isOpen={isDeleteAccountDialogOpen}
        onDelete={handleDeleteAccount}
        onCancel={() => setIsDeleteAccountDialogOpen(false)}
      />
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
