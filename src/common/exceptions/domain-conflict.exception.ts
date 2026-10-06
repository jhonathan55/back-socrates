// domain-conflict.exception.ts

import { ConflictException } from './domain.exception';

export class DomainConflictException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}