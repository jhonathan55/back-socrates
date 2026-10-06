import {
  ConflictException,
  NotFoundException,
} from '@common/exceptions/domain.exception';

export class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Usuario '${id}' no encontrado`);
  }
}

export class UserEmailConflictException extends ConflictException {
  constructor(email: string) {
    super(`El email '${email}' ya está registrado`);
  }
}