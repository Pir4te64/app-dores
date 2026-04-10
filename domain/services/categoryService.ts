import { Category } from '~/domain/entities/categoryEntity';
import { supabase } from '~/infrastructure/supabase/client';
import { mapCategory } from '~/domain/mappers/supabaseMappers';

export class CategoryService {
  private static categoryService: CategoryService;

  static getInstance(): CategoryService {
    if (!CategoryService.categoryService) {
      CategoryService.categoryService = new CategoryService();
    }
    return CategoryService.categoryService;
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message);
    }

    return (data || []).map(mapCategory);
  }
}
