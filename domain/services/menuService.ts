import { Menu, MenuResponse } from '~/domain/entities/menuEntity';
import { supabase } from '~/infrastructure/supabase/client';
import { mapProduct } from '~/domain/mappers/supabaseMappers';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';

interface MenuFilters {
  commerceId?: number | string;
  categoryId?: number | string;
  pageNumber?: number;
  pageSize?: number;
  sortDirection?: string;
  search?: string;
}

export class MenuService {
  private static instance: MenuService;

  static getInstance(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  async getAllMenus(filters: MenuFilters): Promise<MenuResponse> {
    const commerceService = CommerceSupabaseService.getInstance();
    const commerceId = await commerceService.getCommerceId();

    const pageSize = filters.pageSize || 10;
    const pageNumber = filters.pageNumber || 0;
    const from = pageNumber * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('products')
      .select('*, category:categories(*), images:product_images(*)', { count: 'exact' })
      .eq('commerce_id', commerceId)
      .eq('stock', true)
      .order('created_at', { ascending: filters.sortDirection === 'ASC' });

    if (filters.categoryId) {
      query = query.eq('category_id', String(filters.categoryId));
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching menus:', error);
      throw new Error(error.message);
    }

    const menus = (data || []).map(mapProduct);
    const totalElements = count || 0;
    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      content: menus,
      totalElements,
      totalPages,
      number: pageNumber,
      size: pageSize,
    };
  }

  async getMenuByCategory(categoryId: number | string, _token?: string): Promise<MenuResponse> {
    return this.getAllMenus({ categoryId, pageSize: 50 });
  }

  async getMenuSearch(query: string): Promise<MenuResponse> {
    return this.getAllMenus({ search: query, pageSize: 20 });
  }

  async getMenuByCommerce(_commerceId: number): Promise<MenuResponse> {
    return this.getAllMenus({ pageSize: 50 });
  }
}
