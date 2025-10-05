import { Document } from "../../models/entities/document";
import {
  DeleteDocumentParams,
  UploadDocumentRequest,
} from "../../models/requests/document";
import {
  DeleteDocumentResponse,
  UploadDocumentResponse,
} from "../../models/responses/document";
import { ApplicationError } from "../../utils/errors";
import { IDocumentService } from "../document";
import { data } from "./data";

export class MockDocumentService implements IDocumentService {
  async uploadDocument(
    request: UploadDocumentRequest,
    onProgress?: (event: ProgressEvent) => void
  ): Promise<UploadDocumentResponse> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const document: Document = {
          id: request.id,
          name: request.file.name,
          mimetype: request.file.type,
          size: request.file.size,
          projectId: request.projectId ?? null,
          createdAt: new Date(),
          udpatedAt: new Date(),
        };

        data.documents.push(document);

        resolve(document.id);
      }, 300)
    );
  }

  async deleteDocument(
    params: DeleteDocumentParams
  ): Promise<DeleteDocumentResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const documentExists = data.documents.some(
          (document) => document.id === params.documentId
        );

        if (!documentExists) {
          return reject(ApplicationError.notFound());
        }

        data.documents = data.documents.filter(
          (document) => document.id !== params.documentId
        );

        resolve(params.documentId);
      }, 300)
    );
  }
}
