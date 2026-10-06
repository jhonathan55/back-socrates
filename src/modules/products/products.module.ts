import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaClass, ProductSchema } from './infrastructure/mongoose/product.schema';
import { MongooseProductRepository } from './infrastructure/mongoose/mongoose-product.repository';
import { ProductRepositoryPort } from './domain/ports/product.repository.port';
import { ProductsController } from './infrastructure/products.controller';
import { CaslModule } from '@modules/casl/casl.module';
import {
  ListProductsUseCase, GetProductUseCase, CreateProductUseCase,
  UpdateProductUseCase, DeleteProductUseCase,ListCategoriesUseCase
} from './application/use-cases/products.use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
    ]),
    CaslModule,
  ],
  controllers: [ProductsController],
  providers: [
    { provide: ProductRepositoryPort, useClass: MongooseProductRepository },
    ListProductsUseCase,
    GetProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListCategoriesUseCase,
  ],
  exports: [ProductRepositoryPort],
})
export class ProductsModule {}