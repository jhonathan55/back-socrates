import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaClass } from './infrastructure/mongoose/user.schema';
import { UserRepositoryPort } from './domain/ports/user.repository.port';
import { MongooseUserRepository } from './infrastructure/mongoose/mongoose-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  providers: [
    { provide: UserRepositoryPort, useClass: MongooseUserRepository },
  ],
  exports: [UserRepositoryPort],
})
export class UsersModule {}