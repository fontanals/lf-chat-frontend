import { ApplicationResponse } from "../models/responses/response";
import { ApplicationError } from "../utils/errors";
import {
  DeleteRequestOptions,
  GetRequestOptions,
  IHttpClient,
  PatchRequestOptions,
  PostRequestOptions,
  PutRequestOptions,
  Query,
  UploadRequestOptions,
} from "../utils/http-client";
import { ServerSentEvent } from "../utils/types";

export type StreamPostRequestOptions<
  TEvent = ServerSentEvent,
  TQuery extends Query = Query,
  TRequest = unknown
> = PostRequestOptions<TQuery, TRequest> & {
  onEvent: (event: TEvent) => void;
};

export interface IBaseService {
  get<TResponse = unknown, TQuery extends Query = Query>(
    args: GetRequestOptions<TQuery>
  ): Promise<TResponse>;
  post<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    args: PostRequestOptions<TQuery, TRequest>
  ): Promise<TResponse>;
  put<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    args: PutRequestOptions<TQuery, TRequest>
  ): Promise<TResponse>;
  patch<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    args: PatchRequestOptions<TQuery, TRequest>
  ): Promise<TResponse>;
  delete<TResponse = unknown, TQuery extends Query = Query>(
    args: DeleteRequestOptions<TQuery>
  ): Promise<TResponse>;
  streamPost<
    TEvent = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(
    args: StreamPostRequestOptions<TEvent, TQuery, TRequest>
  ): Promise<void>;
  upload<TResponse = unknown, TQuery extends Query = Query>(
    args: UploadRequestOptions<TQuery>
  ): Promise<TResponse>;
}

export class BaseService implements IBaseService {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async get<TResponse = unknown, TQuery extends Query = Query>(
    args: GetRequestOptions<TQuery>
  ): Promise<TResponse> {
    const response = await this.httpClient.get<
      ApplicationResponse<TResponse>,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async post<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PostRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.httpClient.post<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async put<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PutRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.httpClient.put<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async patch<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PatchRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.httpClient.patch<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async delete<TResponse = unknown, TQuery extends Query = Query>(
    args: DeleteRequestOptions<TQuery>
  ): Promise<TResponse> {
    const response = await this.httpClient.delete<
      ApplicationResponse<TResponse>,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async streamPost<
    TEvent = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: StreamPostRequestOptions<TEvent, TQuery, TRequest>): Promise<void> {
    try {
      const stream = await this.httpClient.streamPost<TRequest, TQuery>(args);

      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        buffer += chunk;

        const lines = buffer.split("\n");

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const event = JSON.parse(line.substring(6)) as TEvent;

            args.onEvent(event);
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        throw error;
      }
    }
  }

  async upload<TResponse = unknown, TQuery extends Query = Query>(
    args: UploadRequestOptions<TQuery>
  ): Promise<TResponse> {
    const response = await this.httpClient.upload<
      ApplicationResponse<TResponse>,
      TQuery
    >(args);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }
}
