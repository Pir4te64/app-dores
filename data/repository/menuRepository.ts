import { Menu, MenuResponse } from '~/domain/entities/menuEntity';
import { IMenuRepository, MenuFilters } from '~/domain/repositories/imenuRepository';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export class MenuRepository implements IMenuRepository {
  private apiClient: ApiClient;
  private static instance: MenuRepository;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): MenuRepository {
    if (!MenuRepository.instance) {
      MenuRepository.instance = new MenuRepository();
    }
    return MenuRepository.instance;
  }

  async getAllMenus(filters: MenuFilters): Promise<MenuResponse> {
    const queryParams = new URLSearchParams({
      'page-number': filters.pageNumber?.toString() ?? '0',
      'page-size': filters.pageSize?.toString() ?? '10',
      'commerce-id': filters.commerceId.toString(),
      'sort-direction': filters.sortDirection ?? 'DESC',
      'product-id': filters.productId ?? '',
      'category-id': filters.categoryId?.toString() ?? '',
      price: filters.price ?? '',
      'name-characteristics': filters.nameCharacteristics ?? '',
    });

    const response = await this.apiClient.getWithAuth<MenuResponse>(
      `/menus/user/v1/get-all-menus?${queryParams.toString()}`
    );

    return {
      ...response,
      content: response.content.map((item) => new Menu(item)),
    };
  }

  async getMenuByCategory(categoryId: number, token?: string): Promise<MenuResponse> {
    const response = await this.apiClient.get<MenuResponse>(
      `/menus/user/v1/get-all-menus?page-number=0&page-size=3&category-id=${categoryId}&sort-direction=DESC`,
      token
    );

    return {
      ...response,
      content: response.content.map((item) => new Menu(item)),
    };
  }
  async getMenuByCommerce(commerceId: number) {
    return await this.apiClient.getWithAuth<MenuResponse>(
      `/menus/user/v1/get-all-menus?page-number=0&page-size=1&commerce-id=${commerceId}&sort-direction=DESC`
    );
  }
  async getMenuSearch(query: string): Promise<MenuResponse> {
    const response = await this.apiClient.getWithAuth<MenuResponse>(
      `/menus/user/v1/get-all-menus?page-size=10&page-number=0&sort-direction=ASC&search=${query}`
    );
    return { ...response, content: response.content.map((item) => new Menu(item)) };
  }
}
