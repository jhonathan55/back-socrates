import { UserEntity } from '../../domain/entities/user.entity';
import { UserDocument } from './user.schema';

export class UserMapper {
  static toDomain(doc: UserDocument): UserEntity {
    return UserEntity.reconstruct({
      id: doc._id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      department: doc.department,
      firstName: doc.firstName,
      lastName: doc.lastName,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity): Record<string, unknown> {
    const p = entity.toPrimitives();
    return {
      _id: p.id,
      email: p.email,
      passwordHash: p.passwordHash,
      role: p.role,
      department: p.department,
      firstName: p.firstName,
      lastName: p.lastName,
      isActive: p.isActive,
    };
  }
}