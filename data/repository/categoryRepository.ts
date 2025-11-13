import { Category } from '~/domain/entities/categoryEntity';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export class CategoryRepository {
  private apiClient: ApiClient;
  private static instance: CategoryRepository;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async getAllCategories(token?: string): Promise<Category[]> {
    const categories = await this.apiClient.get<Category[]>(
      '/menus/user/v1/get-all-categories',
      token
    );
    return categories;
  }
}
