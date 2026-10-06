import { randomUUID } from 'crypto';

export interface ProductPrimitives {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  ownerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductProps {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  ownerId: string;
}

export class ProductEntity {
  private constructor(private readonly props: ProductPrimitives) {}

  static create(input: CreateProductProps): ProductEntity {
    if (input.price < 0) throw new Error('El precio no puede ser negativo');
    if (input.stock < 0) throw new Error('El stock no puede ser negativo');
    if (!input.name.trim()) throw new Error('El nombre es requerido');
    return new ProductEntity({
      id: randomUUID(),
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      stock: input.stock,
      category: input.category.trim(),
      ownerId: input.ownerId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstruct(props: ProductPrimitives): ProductEntity {
    return new ProductEntity(props);
  }

  toPrimitives(): ProductPrimitives { return { ...this.props }; }

  get id(): string { return this.props.id; }
  get ownerId(): string { return this.props.ownerId; }

  update(changes: Partial<Omit<ProductPrimitives, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>>): ProductEntity {
    return new ProductEntity({ ...this.props, ...changes, updatedAt: new Date() });
  }
}