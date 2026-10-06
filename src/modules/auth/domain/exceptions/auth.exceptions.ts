import {
  UnauthorizedException,
  InvalidArgumentException,
} from '@common/exceptions/domain.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() { super('Credenciales inválidas'); }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() { super('Token inválido o expirado'); }
}

export class WeakPasswordException extends InvalidArgumentException {
  constructor() {
    super('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
  }
}