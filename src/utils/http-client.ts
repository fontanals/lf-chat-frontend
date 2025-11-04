import { config } from "../config";

export type Query = Record<string, any>;

export type RequestOptions<TQuery = unknown, TRequest = unknown> = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: TQuery;
  request?: TRequest;
  abortSignal?: AbortSignal;
};

export type GetRequestOptions<TQuery = unknown> = Omit<
  RequestOptions<TQuery>,
  "method" | "request"
>;

export type PostRequestOptions<TQuery = unknown, TRequest = unknown> = Omit<
  RequestOptions<TQuery, TRequest>,
  "method"
>;

export type PutRequestOptions<TQuery = unknown, TRequest = unknown> = Omit<
  RequestOptions<TQuery, TRequest>,
  "method"
>;

export type PatchRequestOptions<TQuery = unknown, TRequest = unknown> = Omit<
  RequestOptions<TQuery, TRequest>,
  "method"
>;

export type DeleteRequestOptions<TQuery = unknown> = Omit<
  RequestOptions<TQuery>,
  "method" | "request"
>;

export type UploadRequestOptions<TQuery extends Query = Query> = {
  url: string;
  query?: TQuery;
  request: FormData;
  onProgress?: (event: ProgressEvent) => void;
};

export type StreamResponse = ReadableStream<Uint8Array<ArrayBuffer>>;

export interface IHttpClient {
  setHeader(key: string, value: string): void;
  removeHeader(key: string): void;
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
  streamPost<TRequest = unknown, TQuery extends Query = Query>(
    args: PostRequestOptions<TQuery, TRequest>
  ): Promise<StreamResponse>;
  upload<TResponse = unknown, TQuery extends Query = Query>(
    args: UploadRequestOptions<TQuery>
  ): Promise<TResponse>;
}

export class HttpClient implements IHttpClient {
  private baseUrl = config.VITE_API_BASE_URL;
  private headers = new Headers({
    "Content-Type": "application/json",
    accept: "application/json",
  });

  setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }

  removeHeader(key: string) {
    this.headers.delete(key);
  }

  async get<TResponse = unknown, TQuery extends Query = Query>(
    args: GetRequestOptions<TQuery>
  ): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery>({
      method: "GET",
      url: args.url,
      query: args.query,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  async post<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PostRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "POST",
      url: args.url,
      query: args.query,
      request: args.request,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  async put<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PutRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "PUT",
      url: args.url,
      query: args.query,
      request: args.request,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  async patch<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(args: PatchRequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "PATCH",
      url: args.url,
      query: args.query,
      request: args.request,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  async delete<TResponse = unknown, TQuery extends Query = Query>(
    args: DeleteRequestOptions<TQuery>
  ): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery>({
      method: "DELETE",
      url: args.url,
      query: args.query,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  async streamPost<TRequest = unknown, TQuery extends Query = Query>(
    args: PostRequestOptions<TQuery, TRequest>
  ): Promise<StreamResponse> {
    const response = await this.streamRequest<TQuery, TRequest>({
      method: "POST",
      url: args.url,
      query: args.query,
      request: args.request,
      abortSignal: args.abortSignal,
    });

    return response;
  }

  getUrl<TQuery extends Query = Query>(url: string, query?: TQuery): URL {
    let fullUrl = new URL(url, this.baseUrl);

    if (query != null) {
      const searchParams = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, value.toString());
        }
      });

      fullUrl.search = searchParams.toString();
    }

    return fullUrl;
  }

  async jsonRequest<
    TResponse = unknown,
    TQuery extends Query = Query,
    TRequest = unknown
  >(args: RequestOptions<TQuery, TRequest>): Promise<TResponse> {
    const url = this.getUrl(args.url, args.query);

    const response = await fetch(url.toString(), {
      method: args.method,
      headers: new Headers(this.headers),
      body: JSON.stringify(args.request),
      credentials: "include",
      signal: args.abortSignal,
    });

    const authorizationHeader = response.headers.get("authorization");

    if (authorizationHeader != null) {
      this.headers.set("authorization", authorizationHeader);
    }

    const data = await response.json();

    return data as TResponse;
  }

  async streamRequest<TQuery extends Query = Query, TRequest = unknown>(
    args: RequestOptions<TQuery, TRequest>
  ): Promise<StreamResponse> {
    const url = this.getUrl(args.url, args.query);

    const headers = new Headers(this.headers);
    headers.append("accept", "text/event-stream");

    const response = await fetch(url.toString(), {
      method: args.method,
      headers,
      body: JSON.stringify(args.request),
      credentials: "include",
      signal: args.abortSignal,
    });

    const authorizationHeader = response.headers.get("Authorization");

    if (authorizationHeader != null) {
      this.headers.set("Authorization", authorizationHeader);
    }

    if (response.body == null) {
      throw new Error("Response body is null");
    }

    return response.body;
  }

  async upload<TResponse = unknown, TQuery extends Query = Query>(
    args: UploadRequestOptions<TQuery>
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const url = this.getUrl(args.url, args.query);

      const headers = new Headers(this.headers);
      headers.delete("Content-Type");

      const xhr = new XMLHttpRequest();

      xhr.withCredentials = true;

      xhr.open("POST", url, true);

      headers.forEach((value, key) => xhr.setRequestHeader(key, value));

      if (args.onProgress != null) {
        xhr.upload.onprogress = args.onProgress;
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.response) as TResponse;

          resolve(response);
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      };

      xhr.send(args.request);
    });
  }
}
