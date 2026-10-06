import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepositoryPort } from '@modules/users/domain/ports/user.repository.port';
import { InvalidCredentialsException } from '../../domain/exceptions/auth.exceptions';
import { LoginDto, TokensResultDto } from '../dto/auth.dto';
import { TokenService } from '../../infrastructure/strategies/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<TokensResultDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.isActive) throw new InvalidCredentialsException();

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsException();

    return this.tokenService.generateTokens(user);
  }
}