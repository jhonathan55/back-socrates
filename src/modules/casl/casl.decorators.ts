import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CHECK_POLICIES_KEY, CheckPolicies } from './casl.types';
import { Request } from 'express';

export const CheckPoliciesDecorator = (...handlers: CheckPolicies[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: unknown }>();
    return request.user;
  },
);