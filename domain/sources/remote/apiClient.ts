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
      let errorMessage = `API call failed with status: ${response.status}`;
      let errorBody: any = null;

      try {
        errorBody = await response.json();
      } catch {
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch {
        }
      }

      if (errorBody) {
        const e = errorBody.error ?? errorBody;
        const desc = Array.isArray(e?.description) ? e.description[0] : e?.description;
        const msg = e?.message ?? errorBody?.message ?? errorBody?.error_description;
        errorMessage = desc || msg || errorMessage;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      return await response.json();
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text as any as T;
    }
  }

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
