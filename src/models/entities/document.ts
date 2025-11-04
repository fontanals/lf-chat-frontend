export type Document = {
  id: string;
  name: string;
  mimetype: string;
  sizeInBytes: number;
  isProcessed: boolean;
  chatId?: string | null;
  projectId?: string | null;
  createdAt?: Date;
  udpatedAt?: Date;
};
