import { Box } from "@mui/material";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";
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
import { useDeleteDocument, useUploadDocument } from "../hooks/document";
import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "../hooks/project";

export function ProjectPage() {
  const { projectId } = useParams();
  const { t } = useTranslation();

  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false);

  const { data: project, isLoading } = useProject(projectId!, {
    expand: ["documents"],
  });
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: uploadProjectDocument } = useUploadDocument(projectId!);
  const { mutate: deleteProjectDocument } = useDeleteDocument(projectId!);

  function handleEditProject(values: EditProjectFormSchema) {
    setIsEditProjectDialogOpen(false);

    if (project != null) {
      updateProject({
        params: { projectId: project.id },
        request: values,
      });
    }
  }

  function handleDeleteProject() {
    setIsDeleteProjectDialogOpen(false);

    if (project != null) {
      deleteProject({ params: { projectId: project.id } });
    }
  }

  function handleAddDocument(files?: File[]) {
    files?.forEach((file) =>
      uploadProjectDocument({
        request: { id: uuid(), file, projectId: projectId! },
        // TODO: implement upload progress
        onProgress: () => {},
      })
    );
  }

  function handleDeleteDocument(documentId: string) {
    deleteProjectDocument({ params: { documentId } });
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
        }}
      >
        <Box sx={{ display: "grid", gap: "8px", paddingInline: "16px" }}>
          <Text sx={{ color: "secondary.main" }} variant="body1">
            {project?.title ?? ""}
          </Text>
          <Text noWrap>{project?.description ?? ""}</Text>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Tooltip title={t("edit_project")}>
            <IconButton onClick={() => setIsEditProjectDialogOpen(true)}>
              <PencilIcon size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete_project")} variant="error">
            <IconButton
              sx={{ "&:hover": { color: "error.main" } }}
              onClick={() => setIsDeleteProjectDialogOpen(true)}
            >
              <Trash2Icon size="16px" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <ProjectDocuments
        project={project}
        onAddDocument={handleAddDocument}
        onRemoveDocument={handleDeleteDocument}
      />
      <ProjectChats project={project} />
      <EditProjectDialog
        isOpen={isEditProjectDialogOpen}
        project={project}
        onEditProject={handleEditProject}
        onCancel={() => setIsEditProjectDialogOpen(false)}
      />
      <DeleteProjectDialog
        isOpen={isDeleteProjectDialogOpen}
        project={project}
        onDeleteProject={handleDeleteProject}
        onCancel={() => setIsDeleteProjectDialogOpen(false)}
      />
    </ContentPanel>
  );
}
