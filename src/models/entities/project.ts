import { Document } from "./document";

export type Project = {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  documents?: Document[];
};
