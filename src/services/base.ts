import { ApplicationResponse } from "../models/responses/response";
import { ApplicationError } from "../utils/errors";
import { IHttpClient, Query } from "../utils/http-client";

export interface IBaseService {
  get<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse>;
  post<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    url: string,
    request: TRequest,
    query?: TQuery
  ): Promise<TResponse>;
  put<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    url: string,
    request: TRequest,
    query?: TQuery
  ): Promise<TResponse>;
  patch<TResponse = unknown, TRequest = unknown, TQuery extends Query = Query>(
    url: string,
    request: TRequest,
    query?: TQuery
  ): Promise<TResponse>;
  delete<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse>;
  streamPost<
    TEvent = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(
    url: string,
    request: TRequest,
    onEvent: (event: TEvent) => void,
    query?: TQuery
  ): Promise<void>;
}

export class BaseService implements IBaseService {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async get<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse> {
    const response = await this.httpClient.get<
      ApplicationResponse<TResponse>,
      TQuery
    >(url, query);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async post<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.httpClient.post<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(url, request, query);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async put<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.httpClient.put<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(url, request, query);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async patch<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.httpClient.patch<
      ApplicationResponse<TResponse>,
      TRequest,
      TQuery
    >(url, request, query);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async delete<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse> {
    const response = await this.httpClient.delete<
      ApplicationResponse<TResponse>,
      TQuery
    >(url, query);

    if (!response.success) {
      throw ApplicationError.copy(response.error);
    }

    return response.data;
  }

  async streamPost<
    TEvent = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(
    url: string,
    request: TRequest,
    onEvent: (event: TEvent) => void,
    query?: TQuery
  ): Promise<void> {
    const stream = await this.httpClient.streamPost<TRequest, TQuery>(
      url,
      request,
      query
    );

    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      console.log("Buffer:", buffer);
    }
  }
}
