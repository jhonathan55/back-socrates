import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { PersistenceException } from '@common/exceptions/domain.exception';
import { UserDocument, UserSchemaClass } from './user.schema';
import { UserMapper } from './user.mapper';

@Injectable()
export class MongooseUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async save(user: UserEntity): Promise<void> {
    try {
      await this.model.create(UserMapper.toPersistence(user));
    } catch (error: unknown) {
      throw new PersistenceException('Error al guardar usuario', error instanceof Error ? error : undefined);
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const doc = await this.model.findById(id).exec();
      return doc ? UserMapper.toDomain(doc) : null;
    } catch (error: unknown) {
      throw new PersistenceException('Error al buscar usuario', error instanceof Error ? error : undefined);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const doc = await this.model.findOne({ email: email.toLowerCase() }).exec();
      return doc ? UserMapper.toDomain(doc) : null;
    } catch (error: unknown) {
      throw new PersistenceException('Error al buscar por email', error instanceof Error ? error : undefined);
    }
  }

  async findAll(opts: { page?: number; limit?: number } = {}): Promise<{ items: UserEntity[]; total: number }> {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    try {
      const [docs, total] = await Promise.all([
        this.model.find().skip((page - 1) * limit).limit(limit).exec(),
        this.model.countDocuments().exec(),
      ]);
      return { items: docs.map(UserMapper.toDomain), total };
    } catch (error: unknown) {
      throw new PersistenceException('Error al listar usuarios', error instanceof Error ? error : undefined);
    }
  }

  async update(user: UserEntity): Promise<void> {
    try {
      await this.model.findByIdAndUpdate(user.id, { $set: UserMapper.toPersistence(user) }).exec();
    } catch (error: unknown) {
      throw new PersistenceException('Error al actualizar usuario', error instanceof Error ? error : undefined);
    }
  }
}