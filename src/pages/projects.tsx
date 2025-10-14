import { Box } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { ContentPanel } from "../components/layout/content-panel";
import {
  CreateProjectDialog,
  CreateProjectFormSchema,
} from "../components/project/create-project-dialog";
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
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "../hooks/project";
import { Project } from "../models/entities/project";

export function ProjectsPage() {
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false);

  const { data: projects = [], isLoading } = useProjects();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  function handleCreateProject(values: CreateProjectFormSchema) {
    setIsCreateProjectDialogOpen(false);

    createProject({ request: { id: uuid(), ...values } });
  }

  function handleEditProject(values: EditProjectFormSchema) {
    setIsEditProjectDialogOpen(false);

    if (selectedProject != null) {
      updateProject({
        params: { projectId: selectedProject.id },
        request: values,
      });
    }
  }

  function handleDeleteProject() {
    setIsDeleteProjectDialogOpen(false);

    if (selectedProject != null) {
      deleteProject({ params: { projectId: selectedProject.id } });
    }
  }

  return (
    <ContentPanel>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "48px",
          paddingInline: { xs: "0px", sm: "32px" },
        }}
      >
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
            <ShadowButton onClick={() => setIsCreateProjectDialogOpen(true)}>
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
      <CreateProjectDialog
        isOpen={isCreateProjectDialogOpen}
        onCreateProject={handleCreateProject}
        onCancel={() => setIsCreateProjectDialogOpen(false)}
      />
      <EditProjectDialog
        isOpen={isEditProjectDialogOpen}
        project={selectedProject}
        onEditProject={handleEditProject}
        onCancel={() => setIsEditProjectDialogOpen(false)}
      />
      <DeleteProjectDialog
        isOpen={isDeleteProjectDialogOpen}
        project={selectedProject}
        onDeleteProject={handleDeleteProject}
        onCancel={() => setIsDeleteProjectDialogOpen(false)}
      />
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
