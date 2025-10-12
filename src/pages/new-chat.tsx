import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ContentPanel } from "../components/layout/content-panel";
import { Text } from "../components/ui/text";
import { useUploadDocuments } from "../hooks/document";
import { useUser } from "../hooks/user";
import { UserContentPart } from "../models/entities/message";
import { useChatStore } from "../state/chat";
import { ArrayUtils } from "../utils/arrays";
import { StringUtils } from "../utils/strings";

export function NewChatPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const setPendingMessage = useChatStore((state) => state.setPendingMessage);

  const [message, setMessage] = useState("");

  const { data: user } = useUser();
  const { uploadMap, uploadDocument, deleteDocument } = useUploadDocuments();

  function handleSendMessage() {
    if (
      StringUtils.isNullOrWhitespace(message) &&
      ArrayUtils.isNullOrEmpty(Object.keys(uploadMap))
    ) {
      return;
    }

    const chatId = uuid();

    const contentParts: UserContentPart[] = [];

    Object.values(uploadMap).forEach((item) =>
      contentParts.push({
        type: "document",
        id: item.id,
        name: item.name,
        mimetype: item.mimetype,
      })
    );

    contentParts.push({ type: "text", text: message });

    setPendingMessage({ message: contentParts, chatId });

    navigate(`/chats/${chatId}`);
  }

  function handleAddDocuments(files: File[]) {
    files.forEach((file) => uploadDocument({ request: { id: uuid(), file } }));
  }

  function handleRemoveDocument(id: string) {
    deleteDocument({ params: { documentId: id } });
  }

  return (
    <ContentPanel>
      <Box
        sx={{
          flex: 0.5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: { xs: "16px", sm: "32px" },
        }}
      >
        <Text variant="h5">
          {t("welcome_user_name_how_are_you_doing_today", {
            name: user?.displayName,
          })}
        </Text>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginInline: "16px" }}
      >
        <ChatInput
          containerSx={{ maxWidth: "600px" }}
          placeholder={t("how_can_i_help_you_today")}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onSubmit={handleSendMessage}
          uploadMap={uploadMap}
          onAddDocuments={handleAddDocuments}
          onRemoveDocument={handleRemoveDocument}
          disabled={StringUtils.isNullOrWhitespace(message)}
        />
      </Box>
    </ContentPanel>
  );
}
