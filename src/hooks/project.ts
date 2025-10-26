import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProjectRequest,
  DeleteProjectParams,
  GetProjectQuery,
  UpdateProjectParams,
  UpdateProjectRequest,
} from "../models/requests/project";
import { GetProjectsResponse } from "../models/responses/project";
import { services } from "../services/provider";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => services.project.getProjects(),
  });
}

export function useProject(
  projectId: string,
  query?: GetProjectQuery,
  enabled = true
) {
  return useQuery({
    enabled,
    queryKey: ["projects", projectId],
    queryFn: () => services.project.getProject({ projectId }, query),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { request: CreateProjectRequest }) =>
      services.project.createProject(args.request),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData<GetProjectsResponse>(["projects"], (projects) =>
        projects != null ? [...projects, args.request] : [args.request]
      );

      return { previousProjects };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      params: UpdateProjectParams;
      request: UpdateProjectRequest;
    }) => services.project.updateProject(args.params, args.request),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData<GetProjectsResponse>(["projects"], (projects) =>
        projects?.map((project) =>
          project.id === args.params.projectId
            ? { ...project, ...args.request }
            : project
        )
      );

      return { previousProjects };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { params: DeleteProjectParams }) =>
      services.project.deleteProject(args.params),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData<GetProjectsResponse>(["projects"], (projects) =>
        projects?.filter((project) => project.id !== args.params.projectId)
      );

      return { previousProjects };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
