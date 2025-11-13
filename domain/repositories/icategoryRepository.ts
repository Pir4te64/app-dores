import { Category } from '~/domain/entities/categoryEntity';

export interface ICategoryRepository {
  getAllCategories(token?: string): Promise<Category[]>;
}
