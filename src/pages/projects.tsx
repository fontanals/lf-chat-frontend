import { Box } from "@mui/material";
import { FolderClosedIcon, PlusIcon } from "lucide-react";
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
import { ShadowButton, TextButton } from "../components/ui/button";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "../hooks/project";
import { Project } from "../models/entities/project";
import { ArrayUtils } from "../utils/arrays";

export function ProjectsPage() {
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openDialog, setOpenDialog] = useState<
    "create-project" | "edit-project" | "delete-project" | "none"
  >("none");

  const { data: projects = [], isLoading } = useProjects();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  function handleCreateProject(values: CreateProjectFormSchema) {
    createProject({ request: { id: uuid(), ...values } });

    setOpenDialog("none");
  }

  function handleEditProject(values: EditProjectFormSchema) {
    if (selectedProject != null) {
      updateProject({
        params: { projectId: selectedProject.id },
        request: values,
      });
    }

    setSelectedProject(null);
    setOpenDialog("none");
  }

  function handleDeleteProject() {
    if (selectedProject != null) {
      deleteProject({ params: { projectId: selectedProject.id } });
    }

    setSelectedProject(null);
    setOpenDialog("none");
  }

  return (
    <ContentPanel>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Text sx={{ paddingInline: "16px" }} variant="body1">
          {t("project.title.projects")}
        </Text>
        <ShadowButton onClick={() => setOpenDialog("create-project")}>
          <PlusIcon size="16px" />
          {t("project.button.create_project")}
        </ShadowButton>
      </Box>
      {!isLoading && ArrayUtils.isNullOrEmpty(projects) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px",
          }}
        >
          <Box>
            <FolderClosedIcon size="20px" />
          </Box>
          <Text>{t("project.text.no_projects")}</Text>
          <TextButton onClick={() => setOpenDialog("create-project")}>
            {t("project.button.create_first_project")}
          </TextButton>
        </Box>
      )}
      <ProjectList
        sx={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "16px",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            onEdit={() => {
              setSelectedProject(project);
              setOpenDialog("edit-project");
            }}
            onDelete={() => {
              setSelectedProject(project);
              setOpenDialog("delete-project");
            }}
          />
        ))}
      </ProjectList>
      <CreateProjectDialog
        isOpen={openDialog === "create-project"}
        onCreate={handleCreateProject}
        onCancel={() => setOpenDialog("none")}
      />
      <EditProjectDialog
        isOpen={openDialog === "edit-project"}
        project={selectedProject}
        onEdit={handleEditProject}
        onCancel={() => {
          setSelectedProject(null);
          setOpenDialog("none");
        }}
      />
      <DeleteProjectDialog
        isOpen={openDialog === "delete-project"}
        project={selectedProject}
        onDelete={handleDeleteProject}
        onCancel={() => {
          setSelectedProject(null);
          setOpenDialog("none");
        }}
      />
      <LoadingBackdrop isLoading={isLoading} />
    </ContentPanel>
  );
}
