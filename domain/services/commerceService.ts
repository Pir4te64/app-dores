import { CommerceRepository } from '~/data/repository/commerceRepository';
import { Commerce } from '~/domain/entities/commerceEntity';
import { ICommerceRepository } from '~/domain/repositories/icommerceRepository';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class CommerceService {
  private commerceRepository: ICommerceRepository;
  static instance: CommerceService;
  constructor() {
    this.commerceRepository = CommerceRepository.getInstance();
  }
  static getInstance(): CommerceService {
    if (!CommerceService.instance) {
      CommerceService.instance = new CommerceService();
    }
    return CommerceService.instance;
  }
  async getAllCommerces() {
    return await this.commerceRepository.getAllCommerces();
  }
  async getCommerceById(commerceId: number, addressId?: number) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.commerceRepository.getCommerceById(commerceId, addressId, token ?? undefined);
  }
  async getCommerceByProductId(productId: number) {
    const token = await AsyncStorageService.getItem('accessToken');
    return await this.commerceRepository.getCommerceByProductId(productId, token ?? undefined);
  }
  async getCommerceSearch(query: string) {
    return await this.commerceRepository.getCommerceSearch(query);
  }
  async getCommerceByCategory(categoryId: number): Promise<Commerce[]> {
    return await this.commerceRepository.getCommerceByCategory(categoryId);
  }
}
