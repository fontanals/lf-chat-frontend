export type Query = Record<string, string | number | boolean | string[]>;

export interface IHttpClient {
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

export class HttpClient implements IHttpClient {
  private baseUrl = "";
  private headers = new Headers();

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  setHeader(name: string, value: string): void {
    this.headers.append(name, value);
  }

  removeHeader(name: string): void {
    this.headers.delete(name);
  }

  async get<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery>({
      method: "GET",
      url,
      query,
    });

    return response;
  }

  async post<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "POST",
      url,
      query,
      request,
    });

    return response;
  }

  async put<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "PUT",
      url,
      query,
      request,
    });

    return response;
  }

  async patch<
    TResponse = unknown,
    TRequest = unknown,
    TQuery extends Query = Query
  >(url: string, request: TRequest, query?: TQuery): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery, TRequest>({
      method: "PATCH",
      url,
      query,
      request,
    });

    return response;
  }

  async delete<TResponse = unknown, TQuery extends Query = Query>(
    url: string,
    query?: TQuery
  ): Promise<TResponse> {
    const response = await this.jsonRequest<TResponse, TQuery>({
      method: "DELETE",
      url,
      query,
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
  >(options: {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    query?: TQuery;
    request?: TRequest;
  }): Promise<TResponse> {
    const url = this.getUrl(options.url, options.query);

    const response = await fetch(url.toString(), {
      method: options.method,
      headers: this.headers,
      body: JSON.stringify(options.request),
      credentials: "include",
    });

    const authorizationHeader = response.headers.get("Authorization");

    if (authorizationHeader != null) {
      this.setHeader("Authorization", authorizationHeader);
    }

    const data = await response.json();

    return data as TResponse;
  }
}
