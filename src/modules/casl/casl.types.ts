import { AbilityBuilder, Ability, InferSubjects } from '@casl/ability';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';

// El subject puede ser un string ('Product', 'User', 'all')
// o un objeto con propiedades (para condiciones ABAC como { ownerId })
export type Subjects =
  | 'Product'
  | 'User'
  | 'all'
  | Record<string, unknown>;

export type AppAbility = Ability<[Action, Subjects]>;
export type AbilityBuilderInstance = AbilityBuilder<AppAbility>;

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}
export type PolicyHandlerFn = (ability: AppAbility) => boolean;
export type CheckPolicies = PolicyHandler | PolicyHandlerFn;

export const CHECK_POLICIES_KEY = 'check_policies';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  department: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  department: string;
}