import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@modules/casl/casl.decorators';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import {
  CreateProductDto, UpdateProductDto, ProductFiltersDto,
  ProductResultDto, PaginatedProductsDto,
} from '../application/dto/product.dto';
import {
  ListProductsUseCase, GetProductUseCase, CreateProductUseCase,
  UpdateProductUseCase, DeleteProductUseCase,ListCategoriesUseCase
} from '../application/use-cases/products.use-cases';


@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly listUC: ListProductsUseCase,
    private readonly getUC: GetProductUseCase,
    private readonly createUC: CreateProductUseCase,
    private readonly updateUC: UpdateProductUseCase,
    private readonly deleteUC: DeleteProductUseCase,
     private readonly listCategoriesUC: ListCategoriesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos con filtros' })
  list(@Query() filters: ProductFiltersDto): Promise<PaginatedProductsDto> {
    return this.listUC.execute(filters);
  }

   @Get('categories')
  @ApiOperation({ summary: 'Listar categorías existentes' })
  categories(): Promise<string[]> {
    return this.listCategoriesUC.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  get(@Param('id') id: string): Promise<ProductResultDto> {
    return this.getUC.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear producto (manager o admin)' })
  create(@Body() dto: CreateProductDto, @CurrentUser() user: UserEntity): Promise<ProductResultDto> {
    return this.createUC.execute(dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (owner o admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: UserEntity): Promise<ProductResultDto> {
    return this.updateUC.execute(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar producto (owner o admin)' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity): Promise<void> {
    await this.deleteUC.execute(id, user);
  }
}