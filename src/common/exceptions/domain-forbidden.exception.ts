import { ForbiddenException } from './domain.exception';

export class DomainForbiddenException extends ForbiddenException {
  constructor(message = 'Acceso denegado') {
    super(message);
  }
}