import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRepositoryPort } from '@modules/users/domain/ports/user.repository.port';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserEmailConflictException } from '@modules/users/domain/exceptions/user.exceptions';
import { RegisterDto, TokensResultDto } from '../dto/auth.dto';
import { TokenService } from '../../infrastructure/strategies/token.service';
import { Env } from '@common/config/env.schema';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService<Env>,
  ) {}

  async execute(dto: RegisterDto): Promise<TokensResultDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new UserEmailConflictException(dto.email);

    const rounds = this.config.get<number>('BCRYPT_ROUNDS') ?? 12;
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = UserEntity.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      department: dto.department,
    });

    await this.userRepo.save(user);
    return this.tokenService.generateTokens(user);
  }
}