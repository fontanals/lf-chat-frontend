export type Document = {
  id: string;
  name: string;
  mimetype: string;
  sizeInBytes: number;
  messageId?: string | null;
  projectId?: string | null;
  createdAt?: Date;
  udpatedAt?: Date;
};
