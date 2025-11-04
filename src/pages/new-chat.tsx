import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ContentPanel } from "../components/layout/content-panel";
import { Link } from "../components/ui/link";
import { Text } from "../components/ui/text";
import { useUploadDocuments } from "../hooks/document";
import { useProject } from "../hooks/project";
import { useUser } from "../hooks/user";
import { UserContentBlock } from "../models/entities/message";
import { useChatStore } from "../state/chat";
import { ArrayUtils } from "../utils/arrays";
import { ObjectUtils } from "../utils/objects";
import { StringUtils } from "../utils/strings";

export function NewChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projectId = searchParams.get("projectId");

  const setPendingChat = useChatStore((state) => state.setPendingChat);

  const [message, setMessage] = useState("");

  const { data: user } = useUser();
  const { data: project } = useProject(projectId ?? "", {}, projectId != null);

  const { uploadMap, uploadDocument, deleteDocument } = useUploadDocuments();

  function handleSendMessage() {
    if (
      StringUtils.isNullOrWhitespace(message) &&
      ArrayUtils.isNullOrEmpty(Object.keys(uploadMap))
    ) {
      return;
    }

    const chatId = uuid();

    const contentBlocks: UserContentBlock[] = [];

    Object.values(uploadMap).forEach((item) =>
      contentBlocks.push({
        type: "document",
        id: item.id,
        name: item.name,
      })
    );

    contentBlocks.push({ type: "text", id: uuid(), text: message });

    setPendingChat(chatId, {
      chat: { id: chatId, title: t("new_chat"), project },
      message: contentBlocks,
    });

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
      {project != null && (
        <Link
          style={{
            position: "absolute",
            top: "16px",
            left: "64px",
            display: "flex",
            alignItems: "center",
            height: "36px",
          }}
          to={`/projects/${project.id}`}
        >
          <Text sx={{ "&:hover": { color: "secondary.main" } }}>
            {project.title}
          </Text>
        </Link>
      )}
      <Box
        sx={{
          flex: 0.5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Text variant="h5">
          {t("welcome_user_name_how_are_you_doing_today", {
            name: user?.displayName,
          })}
        </Text>
      </Box>
      <ChatInput
        containerSx={{ marginTop: "16px", maxWidth: "600px" }}
        placeholder={t("how_can_i_help_you_today")}
        value={message}
        isStreaming={false}
        onChange={(event) => setMessage(event.target.value)}
        onSubmit={handleSendMessage}
        onStop={() => {}}
        uploadMap={uploadMap}
        onAddDocuments={handleAddDocuments}
        onRemoveDocument={handleRemoveDocument}
        disabled={
          StringUtils.isNullOrWhitespace(message) &&
          ObjectUtils.isEmpty(uploadMap)
        }
      />
    </ContentPanel>
  );
}
