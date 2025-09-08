import { ApplicationResponse } from "../models/responses/response";
import { ApplicationError } from "../utils/errors";
import { IHttpClient, Query } from "../utils/http-client";

export interface IBaseService {
  setBaseUrl(url: string): void;
  setHeader(name: string, value: string): void;
  removeHeader(name: string): void;
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
}

export class BaseService implements IBaseService {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
    this.httpClient.setBaseUrl(import.meta.env.VITE_API_BASE_URL);
    this.httpClient.setHeader("Content-Type", "application/json");
  }

  setBaseUrl(url: string): void {
    this.httpClient.setBaseUrl(url);
  }

  setHeader(name: string, value: string): void {
    this.httpClient.setHeader(name, value);
  }

  removeHeader(name: string): void {
    this.httpClient.removeHeader(name);
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
}
