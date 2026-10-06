import { randomUUID } from 'crypto';

export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface UserPrimitives {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  email: string;
  passwordHash: string;
  role?: UserRole;
  department?: string;
  firstName: string;
  lastName: string;
}

export class UserEntity {
  private constructor(private readonly props: UserPrimitives) {}

  static create(input: CreateUserProps): UserEntity {
    if (!input.email.includes('@')) throw new Error('Email inválido');
    return new UserEntity({
      id: randomUUID(),
      email: input.email.toLowerCase().trim(),
      passwordHash: input.passwordHash,
      role: input.role ?? USER_ROLE.VIEWER,
      department: input.department ?? 'general',
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstruct(props: UserPrimitives): UserEntity {
    return new UserEntity(props);
  }

  toPrimitives(): UserPrimitives { return { ...this.props }; }

  toPublic(): Omit<UserPrimitives, 'passwordHash'> {
    const { passwordHash: _, ...rest } = this.props;
    return rest;
  }

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get role(): UserRole { return this.props.role; }
  get department(): string { return this.props.department; }
  get isActive(): boolean { return this.props.isActive; }

  updateRole(role: UserRole): UserEntity {
    return new UserEntity({ ...this.props, role, updatedAt: new Date() });
  }
}