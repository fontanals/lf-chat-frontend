import { Box } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentPanel } from "../components/layout/content-panel";
import { DeleteProjectDialog } from "../components/project/delete-project-dialog";
import {
  EditProjectDialog,
  EditProjectFormSchema,
} from "../components/project/edit-project-dialog";
import {
  ProjectList,
  ProjectListItem,
} from "../components/project/project-list";
import { ShadowButton } from "../components/ui/button";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import {
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "../hooks/project";
import { Project } from "../models/entities/project";

export function ProjectsPage() {
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false);

  const { data: projects = [], isLoading } = useProjects();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  function handleEditProject(values: EditProjectFormSchema) {
    if (selectedProject != null) {
      updateProject({
        params: { projectId: selectedProject.id },
        request: values,
      });
    }

    setIsEditProjectDialogOpen(false);
  }

  function handleDeleteProject() {
    if (selectedProject != null) {
      deleteProject({ params: { projectId: selectedProject.id } });
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
              paddingLeft: "16px",
            }}
          >
            <Text variant="body1">{t("projects")}</Text>
            <ShadowButton>
              <PlusIcon size="16px" />
              {t("create_project")}
            </ShadowButton>
          </Box>
          <ProjectList
            sx={{
              overflow: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
            }}
          >
            {projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onEdit={() => {
                  setSelectedProject(project);
                  setIsEditProjectDialogOpen(true);
                }}
                onDelete={() => {
                  setSelectedProject(project);
                  setIsDeleteProjectDialogOpen(true);
                }}
              />
            ))}
          </ProjectList>
        </Box>
      </Box>
      <EditProjectDialog
        isOpen={isEditProjectDialogOpen}
        project={selectedProject}
        onEdit={handleEditProject}
        onCancel={() => setIsEditProjectDialogOpen(false)}
      />
      <DeleteProjectDialog
        isOpen={isDeleteProjectDialogOpen}
        project={selectedProject}
        onDelete={handleDeleteProject}
        onCancel={() => setIsDeleteProjectDialogOpen(false)}
      />
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
