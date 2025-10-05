export type UploadDocumentRequest = {
  id: string;
  file: File;
  projectId?: string | null;
};

export type DeleteDocumentParams = { documentId: string };
