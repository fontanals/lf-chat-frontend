import { Project } from "../../models/entities/project";
import {
  CreateProjectRequest,
  DeleteProjectParams,
  GetProjectParams,
  GetProjectQuery,
  UpdateProjectParams,
  UpdateProjectRequest,
} from "../../models/requests/project";
import {
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  UpdateProjectResponse,
} from "../../models/responses/project";
import { ApplicationError } from "../../utils/errors";
import { IProjectService } from "../project";
import { data } from "./data";

export class MockProjectService implements IProjectService {
  async getProjects(): Promise<GetProjectsResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const projects = data.projects.map((project) => ({ ...project }));

        resolve(projects);
      }, 300)
    );
  }

  async getProject(
    params: GetProjectParams,
    query?: GetProjectQuery
  ): Promise<GetProjectResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const project = data.projects.find(
          (project) => project.id === params.projectId
        );

        if (project == null) {
          return reject(ApplicationError.notFound());
        }

        resolve({
          ...project,
          documents: query?.expand?.includes("documents")
            ? data.documents.filter(
                (document) => document.projectId === project.id
              )
            : undefined,
        });
      }, 300)
    );
  }

  async createProject(
    request: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const project: Project = {
          id: request.id,
          name: request.name,
          description: request.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        data.projects.push(project);

        resolve(project.id);
      }, 300)
    );
  }

  async updateProject(
    params: UpdateProjectParams,
    request: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const project = data.projects.find(
          (project) => project.id === params.projectId
        );

        if (project == null) {
          return reject(ApplicationError.notFound());
        }

        project.name = request.name ?? project.name;
        project.description = request.description ?? project.description;
        project.updatedAt = new Date();

        resolve(project.id);
      }, 300)
    );
  }

  async deleteProject(
    params: DeleteProjectParams
  ): Promise<DeleteProjectResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const projectExists = data.projects.some(
          (project) => project.id === params.projectId
        );

        if (!projectExists) {
          return reject(ApplicationError.notFound());
        }

        data.projects = data.projects.filter(
          (project) => project.id !== params.projectId
        );

        resolve(params.projectId);
      }, 300)
    );
  }
}
