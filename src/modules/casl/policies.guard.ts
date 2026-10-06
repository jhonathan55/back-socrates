import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DomainForbiddenException } from '@common/exceptions/domain-forbidden.exception';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY, CheckPolicies, AppAbility } from './casl.types';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const handlers = this.reflector.getAllAndOverride<CheckPolicies[]>(
      CHECK_POLICIES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!handlers?.length) return true;

    const req = ctx.switchToHttp().getRequest<Request & { user?: UserEntity }>();
    const user = req.user;

    if (!user) throw new DomainForbiddenException('Acceso denegado');

    const ability = this.abilityFactory.createForUser(user);
    const allowed = handlers.every((handler) => this.execHandler(handler, ability));

    if (!allowed) throw new DomainForbiddenException('No tienes permiso para realizar esta acción');

    return true;
  }

  private execHandler(handler: CheckPolicies, ability: AppAbility): boolean {
    if (typeof handler === 'function') return handler(ability);
    return handler.handle(ability);
  }
}