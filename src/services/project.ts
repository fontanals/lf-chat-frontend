import {
  CreateProjectRequest,
  DeleteProjectParams,
  GetProjectParams,
  GetProjectQuery,
  UpdateProjectParams,
  UpdateProjectRequest,
} from "../models/requests/project";
import {
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  UpdateProjectResponse,
} from "../models/responses/project";
import { IBaseService } from "./base";

export interface IProjectService {
  getProjects(): Promise<GetProjectsResponse>;
  getProject(
    params: GetProjectParams,
    query?: GetProjectQuery
  ): Promise<GetProjectResponse>;
  createProject(request: CreateProjectRequest): Promise<CreateProjectResponse>;
  updateProject(
    params: UpdateProjectParams,
    request: UpdateProjectRequest
  ): Promise<UpdateProjectResponse>;
  deleteProject(params: DeleteProjectParams): Promise<DeleteProjectResponse>;
}

export class ProjectService implements IProjectService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async getProjects(): Promise<GetProjectsResponse> {
    const response = await this.baseService.get<GetProjectsResponse>({
      url: "/api/projects",
    });

    return response;
  }

  async getProject(
    params: GetProjectParams,
    query: GetProjectQuery
  ): Promise<GetProjectResponse> {
    const response = await this.baseService.get<
      GetProjectResponse,
      GetProjectQuery
    >({
      url: `/api/projects/${params.projectId}`,
      query,
    });

    return response;
  }

  async createProject(
    request: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await this.baseService.post<
      CreateProjectResponse,
      CreateProjectRequest
    >({
      url: "/api/projects",
      request,
    });

    return response;
  }

  async updateProject(
    params: UpdateProjectParams,
    request: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    const response = await this.baseService.patch<
      UpdateProjectResponse,
      UpdateProjectRequest
    >({
      url: `/api/projects/${params.projectId}`,
      request,
    });

    return response;
  }

  async deleteProject(
    params: DeleteProjectParams
  ): Promise<DeleteProjectResponse> {
    const response = await this.baseService.delete<DeleteProjectResponse>({
      url: `/api/projects/${params.projectId}`,
    });

    return response;
  }
}
