import { UserEntity } from '../entities/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: UserEntity): Promise<void>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findAll(opts?: { page?: number; limit?: number }): Promise<{
    items: UserEntity[];
    total: number;
  }>;
  abstract update(user: UserEntity): Promise<void>;
}