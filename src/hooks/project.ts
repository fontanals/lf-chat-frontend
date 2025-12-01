import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CreateProjectRequest,
  DeleteProjectParams,
  GetProjectQuery,
  UpdateProjectParams,
  UpdateProjectRequest,
} from "../models/requests/project";
import { GetChatsResponse } from "../models/responses/chat";
import { GetProjectsResponse } from "../models/responses/project";
import { services } from "../services/provider";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => services.project.getProjects(),
  });
}

export function useProject(projectId?: string | null, query?: GetProjectQuery) {
  return useQuery({
    enabled: projectId != null,
    queryKey: ["projects", projectId],
    queryFn: () =>
      services.project.getProject({ projectId: projectId! }, query),
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
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();
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

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<GetChatsResponse>([
        "chats",
        "previous",
      ]);

      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
        (response) => {
          if (response == null) {
            return response;
          }

          const items = response.items.filter(
            (chat) => chat.projectId !== args.params.projectId
          );

          const totalItems =
            response.totalItems - (response.items.length - items.length);

          return { ...response, items, totalItems };
        }
      );

      if (
        /^\/projects\/([^\/]+)$/.test(location.pathname) &&
        projectId === args.params.projectId
      ) {
        navigate("/new");
      }

      return { previousProjects, previousChats };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);

      queryClient.setQueryData<GetChatsResponse>(
        ["chats", "previous"],
        context?.previousChats
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
