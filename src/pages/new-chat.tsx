import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ChatInput } from "../components/chat/chat-input";
import { ContentPanel } from "../components/layout/content-panel";
import { Link } from "../components/ui/link";
import { Text } from "../components/ui/text";
import { useProject } from "../hooks/project";
import { useUser } from "../hooks/user";
import { UserContentBlock } from "../models/entities/message";
import { useChatStore } from "../state/chat";

export function NewChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projectId = searchParams.get("projectId");

  const setPendingChat = useChatStore((state) => state.setPendingChat);

  const { data: user } = useUser();
  const { data: project } = useProject(projectId);

  function handleSendMessage(content: UserContentBlock[]) {
    const chatId = uuid();

    setPendingChat(chatId, { id: chatId, message: content, projectId });

    navigate(`/chats/${chatId}`);
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
          {t("chat.text.welcome", { name: user?.displayName })}
        </Text>
      </Box>
      <ChatInput
        containerSx={{ maxWidth: "600px", marginTop: "16px" }}
        placeholder={t("chat.placeholder.new_chat")}
        isStreaming={false}
        onSendMessage={handleSendMessage}
        onStopStream={() => {}}
      />
      <Text
        sx={{ maxWidth: "600px", padding: "8px", color: "secondary.main" }}
        variant="caption"
      >
        {t("common.text.transparency_notice")}
      </Text>
    </ContentPanel>
  );
}
