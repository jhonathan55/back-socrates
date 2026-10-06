import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { AppAbility } from './casl.types';
import { USER_ROLE, UserEntity } from '@modules/users/domain/entities/user.entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case USER_ROLE.ADMIN:
        can('manage', 'all');
        break;
 
      case USER_ROLE.MANAGER:
        can('read', 'Product');
        can('read', 'User');
        can('create', 'Product');
        can('update', 'Product', { ownerId: user.id });
        can('delete', 'Product', { ownerId: user.id });
        cannot('update', 'User');
        cannot('delete', 'User');
        break;

      case USER_ROLE.VIEWER:
        can('read', 'Product');
        can('read', 'User');
        break;
    }

    return build();
  }
}