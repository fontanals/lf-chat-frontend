import { Box, Divider } from "@mui/material";
import { CircleUserIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteAllChats } from "../../hooks/chat";
import { ShadowButton } from "../ui/button";
import { Text } from "../ui/text";
import { DeleteAllChatsDialog } from "./delete-all-chats-dialog";

export function DataTab() {
  const { t } = useTranslation();

  const [isDeleteAllChatsDialogOpen, setIsDeleteAllChatsDialogOpen] =
    useState(false);

  const { mutate: deleteAllChats } = useDeleteAllChats();

  function handleDeleteAllChats() {
    setIsDeleteAllChatsDialogOpen(false);

    deleteAllChats();
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
        <Text variant="body1">{t("profile.title.data")}</Text>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Text>{t("profile.text.delete_all_chats")}</Text>
        <ShadowButton
          color="error"
          onClick={() => setIsDeleteAllChatsDialogOpen(true)}
        >
          <Trash2Icon size="16px" />
          {t("profile.button.delete_all_chats")}
        </ShadowButton>
      </Box>
      <Divider />
      <DeleteAllChatsDialog
        isOpen={isDeleteAllChatsDialogOpen}
        onDelete={handleDeleteAllChats}
        onCancel={() => setIsDeleteAllChatsDialogOpen(false)}
      />
    </Box>
  );
}
