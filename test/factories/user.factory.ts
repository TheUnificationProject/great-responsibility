import { UserEntity } from 'optimus-package';

let counter = 0;

export function createUserEntity(
  overrides: Partial<UserEntity> = {},
): UserEntity {
  counter++;
  return {
    uuid: `uuid-user-${counter}`,
    username: `user${counter}`,
    email: `user${counter}@test.com`,
    password: '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01',
    role: 'user',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    deletedAt: null,
    ...overrides,
  };
}
