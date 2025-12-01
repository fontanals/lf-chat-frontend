import { Box } from "@mui/material";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { ContentPanel } from "../components/layout/content-panel";
import { DeleteProjectDialog } from "../components/project/delete-project-dialog";
import {
  EditProjectDialog,
  EditProjectFormSchema,
} from "../components/project/edit-project-dialog";
import { ProjectChats } from "../components/project/project-chats";
import { ProjectDocuments } from "../components/project/project-documents";
import { IconButton } from "../components/ui/button";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { Tooltip } from "../components/ui/tooltip";
import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "../hooks/project";

export function ProjectPage() {
  const { projectId } = useParams();
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState<
    "edit-project" | "delete-project" | "none"
  >("none");

  const { data: project, isLoading } = useProject(projectId!, {
    expand: ["documents"],
  });
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  function handleEditProject(values: EditProjectFormSchema) {
    if (project != null) {
      updateProject({ params: { projectId: project.id }, request: values });
    }

    setOpenDialog("none");
  }

  function handleDeleteProject() {
    if (project != null) {
      deleteProject({ params: { projectId: project.id } });
    }

    setOpenDialog("none");
  }

  if (isLoading) {
    return (
      <ContentPanel>
        <LoadingBackdrop isLoading />
      </ContentPanel>
    );
  }

  if (project == null) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <ContentPanel>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          width: "100%",
          maxWidth: "800px",
          marginTop: "16px",
        }}
      >
        <Box sx={{ display: "grid", gap: "8px", paddingInline: "16px" }}>
          <Text sx={{ color: "secondary.main" }} variant="body1">
            {project.title}
          </Text>
          <Text noWrap>{project.description}</Text>
        </Box>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Tooltip title={t("project.tooltip.edit_project")}>
            <IconButton
              aria-label={t("project.label.edit_project")}
              onClick={() => setOpenDialog("edit-project")}
            >
              <PencilIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("project.tooltip.delete_project")}>
            <IconButton
              sx={{ "&:hover": { color: "error.main" } }}
              aria-label={t("project.label.delete_project")}
              onClick={() => setOpenDialog("delete-project")}
            >
              <Trash2Icon size="16px" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <ProjectDocuments project={project} />
      <ProjectChats project={project} />
      <EditProjectDialog
        isOpen={openDialog === "edit-project"}
        project={project}
        onEdit={handleEditProject}
        onCancel={() => setOpenDialog("none")}
      />
      <DeleteProjectDialog
        isOpen={openDialog === "delete-project"}
        project={project}
        onDelete={handleDeleteProject}
        onCancel={() => setOpenDialog("none")}
      />
    </ContentPanel>
  );
}
