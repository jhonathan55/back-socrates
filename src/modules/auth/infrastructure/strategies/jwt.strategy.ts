import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '@modules/casl/casl.types';
import { UserMapper } from '@modules/users/infrastructure/mongoose/user.mapper';
import { UserSchemaClass, UserDocument } from '@modules/users/infrastructure/mongoose/user.schema';
import { Env } from '@common/config/env.schema';
import { InvalidTokenException } from '../../domain/exceptions/auth.exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService<Env>,
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload) {
    const doc = await this.userModel.findById(payload.sub).exec();
    if (!doc || !doc.isActive) throw new InvalidTokenException();
    return UserMapper.toDomain(doc);
  }
}