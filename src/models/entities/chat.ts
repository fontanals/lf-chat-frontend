import { Project } from "./project";

export type Chat = {
  id: string;
  title: string;
  projectId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  project?: Project | null;
};
