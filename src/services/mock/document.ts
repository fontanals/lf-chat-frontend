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
import { sleep } from "../../utils/functions";
import { IDocumentService } from "../document";
import { mockData } from "./data";

export class MockDocumentService implements IDocumentService {
  async uploadDocument(
    request: UploadDocumentRequest,
    onProgress?: (event: ProgressEvent) => void
  ): Promise<UploadDocumentResponse> {
    const document: Document = {
      id: request.id,
      name: request.file.name,
      mimetype: request.file.type,
      sizeInBytes: request.file.size,
      projectId: request.projectId ?? null,
      createdAt: new Date(),
      udpatedAt: new Date(),
    };

    mockData.documents.push(document);

    sleep(100);

    onProgress?.({
      loaded: request.file.size / 3,
      total: request.file.size,
    } as any);

    sleep(100);

    onProgress?.({
      loaded: (request.file.size / 3) * 2,
      total: request.file.size,
    } as any);

    sleep(100);

    onProgress?.({
      loaded: request.file.size,
      total: request.file.size,
    } as any);

    return document.id;
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
