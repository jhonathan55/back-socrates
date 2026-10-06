import { UnauthorizedException } from './domain.exception';

export class DomainUnauthorizedException extends UnauthorizedException {
  constructor(message = 'Token requerido o inválido') {
    super(message);
  }
}