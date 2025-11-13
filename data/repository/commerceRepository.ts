import { Commerce } from '~/domain/entities/commerceEntity';
import { ICommerceRepository } from '~/domain/repositories/icommerceRepository';
import { ApiClient } from '~/domain/sources/remote/apiClient';

interface CommerceResponse {
  content: Commerce[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export class CommerceRepository implements ICommerceRepository {
  private apiClient: ApiClient;
  static instance: CommerceRepository;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): CommerceRepository {
    if (!CommerceRepository.instance) {
      CommerceRepository.instance = new CommerceRepository();
    }
    return CommerceRepository.instance;
  }

  async getAllCommerces(): Promise<Commerce[]> {
    const response = await this.apiClient.getWithAuth<CommerceResponse>(
      '/pedidos/user/v1/get-all-commerce?page-size=10&page-number=0&sort-direction=ASC'
    );

    return response.content.map((commerce) => new Commerce(commerce));
  }

  async getCommerceById(
    id: number,
    addressId?: number,
    token?: string
  ): Promise<Commerce | undefined> {
    let endpoint = `/pedidos/user/v1/get-all-commerce?commerce-id=${id}&page-size=10&page-number=0&sort-direction=ASC`;
    if (addressId) endpoint += `&id-delivery-address=${addressId}`;
    const response = await this.apiClient.get<CommerceResponse | undefined>(endpoint, token);
    return response?.content.find((commerce) => commerce.id === id);
  }
  async getCommerceByProductId(id: number, token?: string): Promise<Commerce[]> {
    const response = await this.apiClient.get<CommerceResponse>(
      `/pedidos/user/v1/get-all-commerce?product-id=${id}&page-size=10&page-number=0&sort-direction=ASC`,
      token
    );
    return response.content;
  }
  async getCommerceSearch(query: string): Promise<Commerce[]> {
    const response = await this.apiClient.getWithAuth<CommerceResponse>(
      `/pedidos/user/v1/get-all-commerce?page-size=10&page-number=0&sort-direction=ASC&search=${query}`
    );
    return response.content;
  }
  async getCommerceByCategory(categoryId: number): Promise<Commerce[]> {
    const response = await this.apiClient.getWithAuth<CommerceResponse>(
      `/pedidos/user/v1/get-all-commerce?category-id=${categoryId}&page-size=10&page-number=0&sort-direction=ASC`
    );
    return response.content;
  }
}
