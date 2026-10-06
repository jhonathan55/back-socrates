export abstract class DomainException extends Error {
  abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class NotFoundException extends DomainException {
  readonly statusCode = 404;
}

export abstract class InvalidArgumentException extends DomainException {
  readonly statusCode = 400;
}

export abstract class ConflictException extends DomainException {
  readonly statusCode = 409;
}

export abstract class UnauthorizedException extends DomainException {
  readonly statusCode = 401;
}

export abstract class ForbiddenException extends DomainException {
  readonly statusCode = 403;
}

export class PersistenceException extends DomainException {
  readonly statusCode = 500;
  constructor(message: string, public readonly cause?: Error) {
    super(message);
  }
}

