import { ProductEntity } from '../entities/product.entity';

export interface ProductFilters {
  category?: string;
  ownerId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export abstract class ProductRepositoryPort {
  abstract save(product: ProductEntity): Promise<void>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract findAll(opts?: { page?: number; limit?: number; filters?: ProductFilters }): Promise<{
    items: ProductEntity[];
    total: number;
  }>;
  abstract update(product: ProductEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}