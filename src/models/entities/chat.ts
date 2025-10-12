import { Project } from "./project";

export type Chat = {
  id: string;
  title: string;
  projectId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  project?: Project | null;
};
