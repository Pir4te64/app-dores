import { CategoryRepository } from '~/data/repository/categoryRepository';
import { Category } from '~/domain/entities/categoryEntity';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class CategoryService {
  private categoryRepository: CategoryRepository;
  private static categoryService: CategoryService;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  static getInstance(): CategoryService {
    if (!CategoryService.categoryService) {
      CategoryService.categoryService = new CategoryService();
    }
    return CategoryService.categoryService;
  }

  async getCategories(): Promise<Category[]> {
    const token = await AsyncStorageService.getItem('accessToken');
    return this.categoryRepository.getAllCategories(token ?? undefined);
  }
}
