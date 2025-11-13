import { withAuth } from '~/infrastructure/http/authInterceptor';

export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
  status: number;
};

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'https://dores.cruznegradev.com/api';
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Generic request method with improved error handling
   */
  private async request<T>({
    method,
    endpoint,
    data,
    token,
    contentType = 'application/json',
  }: {
    method: string;
    endpoint: string;
    data?: any;
    token?: string;
    contentType?: string;
  }): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': contentType,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = `${this.baseUrl}${endpoint}`;
      let body: any = undefined;

      if (data) {
        body = contentType === 'application/json' ? JSON.stringify(data) : data;
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          data,
          error: null,
          status: response.status,
        };
      }

      return {
        data: null,
        error: new Error(`Request failed with status: ${response.status}`),
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        status: 0,
      };
    }
  }

  /**
   * Authenticated request wrapper
   */
  private async authRequest<T>(options: {
    method: string;
    endpoint: string;
    data?: any;
    contentType?: string;
  }): Promise<ApiResponse<T>> {
    return withAuth((token) =>
      this.request<T>({
        ...options,
        token,
      })
    );
  }

  // GET methods
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      token,
    });
  }

  async getWithAuth<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.authRequest<T>({
      method: 'GET',
      endpoint,
    });
  }

  // POST methods
  async post<T>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      token,
    });
  }

  async postWithAuth<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.authRequest<T>({
      method: 'POST',
      endpoint,
      data,
    });
  }

  async postFormData<T>(endpoint: string, data: FormData, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      data,
      token,
      contentType: 'multipart/form-data',
    });
  }

  async postFormDataWithAuth<T>(endpoint: string, data: FormData): Promise<ApiResponse<T>> {
    return this.authRequest<T>({
      method: 'POST',
      endpoint,
      data,
      contentType: 'multipart/form-data',
    });
  }

  // PUT methods
  async put<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      data,
      token,
    });
  }

  async putWithAuth<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.authRequest<T>({
      method: 'PUT',
      endpoint,
      data,
    });
  }

  // DELETE methods
  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint,
      token,
    });
  }

  async deleteWithAuth<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.authRequest<T>({
      method: 'DELETE',
      endpoint,
    });
  }
}
