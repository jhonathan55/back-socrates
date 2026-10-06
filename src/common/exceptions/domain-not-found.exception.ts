// domain-not-found.exception.ts

import { NotFoundException } from './domain.exception';

export class DomainNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}