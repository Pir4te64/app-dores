import { MenuRepository } from '~/data/repository/menuRepository';
import { IMenuRepository, MenuFilters } from '~/domain/repositories/imenuRepository';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class MenuService {
  private menuRepository: IMenuRepository;
  private static instance: MenuService;

  constructor() {
    this.menuRepository = MenuRepository.getInstance();
  }

  static getInstance(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  async getAllMenus(filters: MenuFilters) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.menuRepository.getAllMenus(filters, token ?? undefined);
  }

  async getMenuByCategory(categoryId: number) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.menuRepository.getMenuByCategory(categoryId, token ?? undefined);
  }
  async getMenuSearch(query: string) {
    return await this.menuRepository.getMenuSearch(query);
  }
  async getMenuByCommerce(commerceId: number) {
    return await this.menuRepository.getMenuByCommerce(commerceId);
  }
}
