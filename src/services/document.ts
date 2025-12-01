import {
  DeleteDocumentParams,
  UploadDocumentRequest,
} from "../models/requests/document";
import {
  DeleteDocumentResponse,
  UploadDocumentResponse,
} from "../models/responses/document";
import { IBaseService } from "./base";

export interface IDocumentService {
  uploadDocument(
    request: UploadDocumentRequest
  ): Promise<UploadDocumentResponse>;
  deleteDocument(params: DeleteDocumentParams): Promise<DeleteDocumentResponse>;
}

export class DocumentService implements IDocumentService {
  private readonly baseService: IBaseService;

  constructor(baseService: IBaseService) {
    this.baseService = baseService;
  }

  async uploadDocument(
    request: UploadDocumentRequest
  ): Promise<UploadDocumentResponse> {
    const formData = new FormData();

    formData.append("id", request.id);
    formData.append("file", request.file);

    if (request.projectId != null) {
      formData.append("projectId", request.projectId);
    }

    const response = await this.baseService.upload<UploadDocumentResponse>({
      url: "/api/documents/upload",
      request: formData,
    });

    return response;
  }

  async deleteDocument(
    params: DeleteDocumentParams
  ): Promise<DeleteDocumentResponse> {
    const response = await this.baseService.delete<DeleteDocumentResponse>({
      url: `/api/documents/${params.documentId}`,
    });

    return response;
  }
}
