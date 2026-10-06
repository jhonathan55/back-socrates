import { NotFoundException } from '@common/exceptions/domain.exception';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Producto '${id}' no encontrado`);
  }
}