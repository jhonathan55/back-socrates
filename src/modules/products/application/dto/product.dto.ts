import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductEntity } from '../../domain/entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Dell XPS 13' })
  @IsString() @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: 'Laptop ultradelgada' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ example: 1299990 })
  @IsNumber() @Min(0) @Type(() => Number)
  price!: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  stock?: number;

  @ApiProperty({ example: 'electronica' })
  @IsString() @MinLength(1)
  category!: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductFiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  category?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ default: 1 }) @IsOptional() @IsNumber() @Min(1) @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 20 }) @IsOptional() @IsNumber() @Min(1) @Type(() => Number)
  limit?: number;
}

export class ProductResultDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() description!: string;
  @ApiProperty() price!: number;
  @ApiProperty() stock!: number;
  @ApiProperty() category!: string;
  @ApiProperty() ownerId!: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;

  static fromEntity(e: ProductEntity): ProductResultDto {
    const dto = new ProductResultDto();
    Object.assign(dto, e.toPrimitives());
    return dto;
  }
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductResultDto] }) items!: ProductResultDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}