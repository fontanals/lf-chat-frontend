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
import { mockData } from "./data";

export class MockDocumentService implements IDocumentService {
  async uploadDocument(
    request: UploadDocumentRequest
  ): Promise<UploadDocumentResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (mockData.documents.length >= 10) {
          return reject(ApplicationError.maxUserDocumentsReached());
        }

        const document: Document = {
          id: request.id,
          key: "",
          name: request.file.name,
          mimetype: request.file.type,
          sizeInBytes: request.file.size,
          isProcessed: false,
          chatId: null,
          projectId: request.projectId ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockData.documents.push(document);

        resolve(document.id);
      }, 300)
    );
  }

  async deleteDocument(
    params: DeleteDocumentParams
  ): Promise<DeleteDocumentResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const documentExists = mockData.documents.some(
          (document) => document.id === params.documentId
        );

        if (!documentExists) {
          return reject(ApplicationError.notFound());
        }

        mockData.documents = mockData.documents.filter(
          (document) => document.id !== params.documentId
        );

        resolve(params.documentId);
      }, 300)
    );
  }
}
