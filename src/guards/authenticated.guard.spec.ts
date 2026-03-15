import { createUserEntity } from '@factories/user.factory';
import { AuthenticatedGuard } from '@guards/authenticated.guard';
import type { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import type { UserEntity } from 'optimus-package';

function createMockContext(user: Nullable<UserEntity>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    guard = new AuthenticatedGuard();
  });

  describe('canActivate', () => {
    it('should allow access for authenticated user', () => {
      const user = createUserEntity();
      const context = createMockContext(user);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access for unauthenticated user', () => {
      const context = createMockContext(null);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
