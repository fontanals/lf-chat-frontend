export type Document = {
  id: string;
  name: string;
  mimetype: string;
  size: number;
  projectId?: string | null;
  createdAt?: Date;
  udpatedAt?: Date;
};
