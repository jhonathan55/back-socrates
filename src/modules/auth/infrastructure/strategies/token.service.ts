import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { TokensResultDto } from '../../application/dto/auth.dto';
import { JwtPayload } from '@modules/casl/casl.types';
import { Env } from '@common/config/env.schema';
import { StringValue } from 'ms';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env>,
  ) {}

  generateTokens(user: UserEntity): TokensResultDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    const expiresIn =(this.config.get('JWT_ACCESS_EXPIRES_IN') as StringValue) ?? '15m';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') ?? 'secretDummi';
    const refreshExpiresIn =(this.config.get('JWT_REFRESH_EXPIRES_IN') as StringValue) ?? '7d';
    
    const accessToken = this.jwt.sign(payload, { expiresIn });
    const refreshToken = this.jwt.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return TokensResultDto.create(accessToken, refreshToken, this.parseSeconds(expiresIn));
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') ?? '';
      return this.jwt.verify<JwtPayload>(token, { secret: refreshSecret });
    } catch {
      return null;
    }
  }

  private parseSeconds(duration: string): number {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) return 900;
    const value = parseInt(match[1]);
    const unit = match[2];
    const map: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * (map[unit] ?? 1);
  }
}