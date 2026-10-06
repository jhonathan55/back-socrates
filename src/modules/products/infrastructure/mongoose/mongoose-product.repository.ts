import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,type QueryFilter} from 'mongoose';
import {
  ProductRepositoryPort,
  ProductFilters,
} from '../../domain/ports/product.repository.port';
import {
  ProductEntity,
  ProductPrimitives,
} from '../../domain/entities/product.entity';
import { PersistenceException } from '@common/exceptions/domain.exception';
import { ProductSchemaClass, ProductDocument } from './product.schema';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';

function toDomain(doc: ProductDocument): ProductEntity {
  return ProductEntity.reconstruct({
    id: doc._id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
    ownerId: doc.ownerId,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

function toPersistence(entity: ProductEntity) {
  const { id, ...data } = entity.toPrimitives();
  return { _id: id, ...data };
}

function toUpdateData(entity: ProductEntity) {
  const { id, createdAt, updatedAt, ...data } = entity.toPrimitives();
  return data;
}

@Injectable()
export class MongooseProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly model: Model<ProductDocument>,
  ) {}

  async save(product: ProductEntity): Promise<void> {
    try {
      await this.model.create(toPersistence(product));
    } catch (e: unknown) {
      throw new PersistenceException(
        'Error al guardar producto',
        e instanceof Error ? e : undefined,
      );
    }
  }

  async findById(id: string): Promise<ProductEntity | null> {
    try {
      const doc = await this.model.findById(id).exec();
      return doc ? toDomain(doc) : null;
    } catch (e: unknown) {
      throw new PersistenceException(
        'Error al buscar producto',
        e instanceof Error ? e : undefined,
      );
    }
  }

  async findAll(
    opts: { page?: number; limit?: number; filters?: ProductFilters } = {},
  ): Promise<{ items: ProductEntity[]; total: number }> {
 
    const query: QueryFilter<ProductSchemaClass> = { isActive: true };

    if (opts.filters?.category) query.category = opts.filters.category;
    if (opts.filters?.ownerId) query.ownerId = opts.filters.ownerId;

    if (
      opts.filters?.minPrice !== undefined ||
      opts.filters?.maxPrice !== undefined
    ) {
      query.price = {
        ...(opts.filters.minPrice !== undefined
          ? { $gte: opts.filters.minPrice }
          : {}),
        ...(opts.filters.maxPrice !== undefined
          ? { $lte: opts.filters.maxPrice }
          : {}),
      };
    }

    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 20));

    try {
      const [docs, total] = await Promise.all([
        this.model
          .find(query)
          .sort({ createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .exec(),
        this.model.countDocuments(query).exec(),
      ]);
      return { items: docs.map(toDomain), total };
    } catch (e: unknown) {
      throw new PersistenceException(
        'Error al listar productos',
        e instanceof Error ? e : undefined,
      );
    }
  }

  async update(product: ProductEntity): Promise<void> {
    try {
      const { id } = product.toPrimitives();

      const updated = await this.model
        .findOneAndUpdate(
          { _id: id, isActive: true },
          { $set: toUpdateData(product) },
          { runValidators: true, new: true },
        )
        .exec();

      if (!updated) {
        throw new ProductNotFoundException(id);
      }
    } catch (error: unknown) {
      if (error instanceof ProductNotFoundException) throw error;

      throw new PersistenceException(
        'Error al actualizar producto',
        error instanceof Error ? error : undefined,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.model
        .findOneAndUpdate(
          { _id: id, isActive: true },
          { $set: { isActive: false } },
          { runValidators: true },
        )
        .exec();

      if (!deleted) {
        throw new ProductNotFoundException(id);
      }
    } catch (error: unknown) {
      if (error instanceof ProductNotFoundException) throw error;

      throw new PersistenceException(
        'Error al eliminar producto',
        error instanceof Error ? error : undefined,
      );
    }
  }
}
