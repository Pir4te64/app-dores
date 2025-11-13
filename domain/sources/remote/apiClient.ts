import { withAuth } from '~/infrastructure/http/authInterceptor';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ContentType = 'json' | 'formData';

export class ApiClient {
  private baseUrl: string;
  private static instance: ApiClient;

  constructor() {
    this.baseUrl = 'https://dores.cruznegradev.com/api';
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Generic request method that handles different HTTP methods and content types
   */
  private async request<T>({
    method,
    endpoint,
    data,
    token,
    contentType = 'json',
  }: {
    method: HttpMethod;
    endpoint: string;
    data?: any;
    token?: string;
    contentType?: ContentType;
  }): Promise<T> {
    const headers: HeadersInit = {};

    if (contentType === 'json') {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    let body: any = undefined;
    if (data) {
      if (contentType === 'json') {
        body = JSON.stringify(data);
      } else if (contentType === 'formData') {
        body = data;
      }
    }
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error.description[0] || `API call failed with status: ${response.status}`
      );
    }
    return await response.json();
  }

  /**
   * Authenticated request wrapper
   */
  private async requestWithAuth<T>({
    method,
    endpoint,
    data,
    contentType = 'json',
  }: {
    method: HttpMethod;
    endpoint: string;
    data?: any;
    contentType?: ContentType;
  }): Promise<T> {
    return withAuth((token) =>
      this.request<T>({
        method,
        endpoint,
        data,
        token,
        contentType,
      })
    );
  }

  // GET methods
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      token,
    });
  }

  async getWithAuth<T>(endpoint: string): Promise<T> {
    return this.requestWithAuth<T>({
      method: 'GET',
      endpoint,
    });
  }

  // POST methods
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      token,
      contentType: 'json',
    });
  }

  async postFormData<T>(endpoint: string, data?: FormData, token?: string): Promise<T> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      token,
      contentType: 'formData',
    });
  }

  async postWithAuth<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithAuth<T>({
      method: 'POST',
      endpoint,
      data,
      contentType: 'json',
    });
  }

  async postWithAuthForm<T>(endpoint: string, data?: FormData): Promise<T> {
    return this.requestWithAuth<T>({
      method: 'POST',
      endpoint,
      data,
      contentType: 'formData',
    });
  }

  // PUT methods
  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      token,
      contentType: 'json',
    });
  }

  async putFormData<T>(endpoint: string, data?: FormData, token?: string): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      token,
      contentType: 'formData',
    });
  }

  async putWithAuth<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithAuth<T>({
      method: 'PUT',
      endpoint,
      data,
      contentType: 'json',
    });
  }

  async putWithAuthForm<T>(endpoint: string, data?: FormData): Promise<T> {
    return this.requestWithAuth<T>({
      method: 'PUT',
      endpoint,
      data,
      contentType: 'formData',
    });
  }
  async deleteWithAuth<T>(endpoint: string, data?: any): Promise<T> {
    return this.requestWithAuth<T>({ method: 'DELETE', endpoint, data, contentType: 'json' });
  }
}
