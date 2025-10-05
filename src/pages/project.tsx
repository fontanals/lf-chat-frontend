import { Box, alpha } from "@mui/material";
import {
  EllipsisVerticalIcon,
  FileIcon,
  FilePlus2Icon,
  FilePlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router";
import { ChatInput } from "../components/chat/chat-input";
import { ContentPanel } from "../components/layout/content-panel";
import { DeleteProjectDialog } from "../components/project/delete-project-dialog";
import {
  EditProjectDialog,
  EditProjectFormSchema,
} from "../components/project/edit-project-dialog";
import { ProjectMenu } from "../components/project/project-menu";
import { IconButton } from "../components/ui/button";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "../hooks/project";
import { useChats } from "../hooks/chat";
import { SearchParamsUtils } from "../utils/search-params";
import { ChatList, ChatListItem } from "../components/chat/chat-list";
import { Input } from "../components/ui/input";

export function ProjectPage() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const paramsSearch = searchParams.get("search") ?? "";
  const cursor = SearchParamsUtils.getDate(searchParams, "cursor");

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false);

  const { data: project, isLoading } = useProject(projectId!, {
    expand: ["documents"],
  });
  const { data: paginatedChats } = useChats({
    search: paramsSearch,
    projectId: projectId!,
    cursor: cursor ?? undefined,
    limit: 20,
  });
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  function handleEditProject(values: EditProjectFormSchema) {
    if (project != null) {
      updateProject({
        params: { projectId: project.id },
        request: values,
      });
    }

    setIsEditProjectDialogOpen(false);
  }

  function handleDeleteProject() {
    if (project != null) {
      deleteProject({ params: { projectId: project.id } });
    }

    setIsDeleteProjectDialogOpen(false);
  }

  return (
    <ContentPanel>
      <Box sx={{ display: "flex", justifyContent: "center", padding: "48px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              paddingInline: "12px",
            }}
          >
            <Box sx={{ display: "grid", gap: "8px" }}>
              <Text sx={{ color: "secondary.main" }} variant="body1">
                {project?.name ?? ""}
              </Text>
              <Text noWrap>{project?.description ?? ""}</Text>
            </Box>
            <IconButton
              sx={{ color: "primary.main" }}
              size="small"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAnchorElement(event.currentTarget);
              }}
            >
              <EllipsisVerticalIcon size="16px" />
            </IconButton>
            <ProjectMenu
              anchorElement={anchorElement}
              onEdit={() => {
                setAnchorElement(null);
                setIsEditProjectDialogOpen(true);
              }}
              onDelete={() => {
                setAnchorElement(null);
                setIsDeleteProjectDialogOpen(true);
              }}
              onClose={() => setAnchorElement(null)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingInline: "12px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text sx={{ color: "text.secondary" }}>Documents</Text>
              <IconButton
                sx={{ color: "primary.main" }}
                size="small"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setAnchorElement(event.currentTarget);
                }}
              >
                <FilePlus2Icon size="16px" />
              </IconButton>
            </Box>
            {project?.documents?.map((document) => (
              <Text>{document.name}</Text>
            ))}
          </Box>
          <ChatInput
            placeholder="How can i help you today?"
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text sx={{ paddingInline: "12px", color: "text.secondary" }}>
              Chats
            </Text>
            <Input
              placeholder={t("search")}
              fullWidth
              value={""}
              onChange={() => {}}
            />
            <ChatList>
              {paginatedChats?.chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  sx={{ paddingInline: "12px" }}
                  chat={chat}
                />
              ))}
            </ChatList>
          </Box>
        </Box>
      </Box>
      <EditProjectDialog
        isOpen={isEditProjectDialogOpen}
        project={project}
        onEdit={handleEditProject}
        onCancel={() => setIsEditProjectDialogOpen(false)}
      />
      <DeleteProjectDialog
        isOpen={isDeleteProjectDialogOpen}
        project={project}
        onDelete={handleDeleteProject}
        onCancel={() => setIsDeleteProjectDialogOpen(false)}
      />
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
