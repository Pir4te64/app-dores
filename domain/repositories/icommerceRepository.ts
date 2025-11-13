import { Commerce } from '~/domain/entities/commerceEntity';

export interface ICommerceRepository {
  getAllCommerces(): Promise<Commerce[]>;
  getCommerceById(id: number, addressId?: number, token?: string): Promise<Commerce | undefined>;
  getCommerceByProductId(id: number, token?: string): Promise<Commerce[]>;
  getCommerceSearch(query: string): Promise<Commerce[]>;
  getCommerceByCategory(categoryId: number): Promise<Commerce[]>;
}
