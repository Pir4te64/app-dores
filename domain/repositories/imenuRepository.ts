import { MenuResponse } from '~/domain/entities/menuEntity';

export interface MenuFilters {
  pageNumber?: number;
  pageSize?: number;
  commerceId: number;
  sortDirection?: 'ASC' | 'DESC';
  productId?: string;
  categoryId?: number;
  price?: string;
  nameCharacteristics?: string;
}

export interface IMenuRepository {
  getAllMenus(filters: MenuFilters, token?: string): Promise<MenuResponse>;
  getMenuByCategory(categoryId: number, token?: string): Promise<MenuResponse>;
  getMenuSearch(query: string): Promise<MenuResponse>;
  getMenuByCommerce(commerceId: number): Promise<MenuResponse>;
}
