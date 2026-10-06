import { Injectable } from '@nestjs/common';
import { subject } from '@casl/ability';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions';
import { DomainForbiddenException }
  from '@common/exceptions/domain-forbidden.exception';
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import {
  CreateProductDto, UpdateProductDto, ProductFiltersDto,
  ProductResultDto, PaginatedProductsDto,
} from '../dto/product.dto';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(filters: ProductFiltersDto): Promise<PaginatedProductsDto> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const { items, total } = await this.repo.findAll({ page, limit, filters });
    return { items: items.map(ProductResultDto.fromEntity), total, page, limit };
  }
}

@Injectable()
export class GetProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(id: string): Promise<ProductResultDto> {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    return ProductResultDto.fromEntity(product);
  }
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly repo: ProductRepositoryPort,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  async execute(dto: CreateProductDto, currentUser: UserEntity): Promise<ProductResultDto> {
    const ability = this.abilityFactory.createForUser(currentUser);
    if (!ability.can('create', 'Product')) {
      throw new DomainForbiddenException('No tienes permiso para crear productos');
    }
    const product = ProductEntity.create({
      name: dto.name,
      description: dto.description ?? '',
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.category,
      ownerId: currentUser.id,
    });
    await this.repo.save(product);
    return ProductResultDto.fromEntity(product);
  }
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly repo: ProductRepositoryPort,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  async execute(id: string, dto: UpdateProductDto, currentUser: UserEntity): Promise<ProductResultDto> {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundException(id);

    // ABAC: evalúa contra el recurso concreto con su ownerId
    const ability = this.abilityFactory.createForUser(currentUser);
    const productSubject = subject('Product', { ...product.toPrimitives(), kind: 'Product' });
    if (!ability.can('update', productSubject as unknown as 'Product')) {
      throw new DomainForbiddenException('No tienes permiso para actualizar este producto');
    }

    const updated = product.update(dto);
    await this.repo.update(updated);
    return ProductResultDto.fromEntity(updated);
  }
}

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly repo: ProductRepositoryPort,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  async execute(id: string, currentUser: UserEntity): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) throw new ProductNotFoundException(id);

    const ability = this.abilityFactory.createForUser(currentUser);
    const productSubject = subject('Product', { ...product.toPrimitives(), kind: 'Product' });
    if (!ability.can('delete', productSubject as unknown as 'Product')) {
      throw new DomainForbiddenException('No tienes permiso para eliminar este producto');
    }

    await this.repo.delete(id);
  }
}

@Injectable()
export class ListCategoriesUseCase {
  constructor(private readonly repo: ProductRepositoryPort) {}

  async execute(): Promise<string[]> {
    const { items } = await this.repo.findAll({ page: 1, limit: 1000 });
    const categories = new Set(items.map((p) => p.toPrimitives().category));
    return Array.from(categories).sort();
  }
}