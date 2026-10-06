import { DomainUnauthorizedException } from '@/common/exceptions/domain-unauthorized.exception';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(ctx: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) return true;
        return super.canActivate(ctx);
    }

    handleRequest<T>(err: unknown, user: T): T {
        if (err || !user) {
            throw new DomainUnauthorizedException('Token requerido o inválido',);
        }
        return user;
    }
}