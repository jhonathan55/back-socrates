import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsEnum, IsOptional, IsString, MinLength, Matches,
} from 'class-validator';
import { USER_ROLE, UserRole } from '@modules/users/domain/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@ripley.cl' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe tener mayúscula, minúscula y número',
  })
  password!: string;

  @ApiProperty({ example: 'Juan' })
  @IsString() @MinLength(1)
  firstName!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString() @MinLength(1)
  lastName!: string;

  @ApiPropertyOptional({ enum: USER_ROLE, default: USER_ROLE.VIEWER })
  @IsOptional() @IsEnum(USER_ROLE)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'tecnologia' })
  @IsOptional() @IsString()
  department?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'usuario@ripley.cl' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass123!' })
  @IsString() @MinLength(1)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString() @MinLength(1)
  refreshToken!: string;
}

export class TokensResultDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty() expiresIn!: number;

  static create(accessToken: string, refreshToken: string, expiresIn: number): TokensResultDto {
    const dto = new TokensResultDto();
    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;
    dto.expiresIn = expiresIn;
    return dto;
  }
}