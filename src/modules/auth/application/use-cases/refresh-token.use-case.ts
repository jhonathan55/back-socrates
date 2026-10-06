import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '@modules/users/domain/ports/user.repository.port';
import { UserNotFoundException } from '@modules/users/domain/exceptions/user.exceptions';
import { InvalidTokenException } from '../../domain/exceptions/auth.exceptions';
import { RefreshTokenDto, TokensResultDto } from '../dto/auth.dto';
import { TokenService } from '../../infrastructure/strategies/token.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<TokensResultDto> {
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    if (!payload) throw new InvalidTokenException();

    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive) throw new UserNotFoundException(payload.sub);

    return this.tokenService.generateTokens(user);
  }
}