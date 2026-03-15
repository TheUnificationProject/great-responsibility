import { createUserEntity } from '@factories/user.factory';
import { OwnerGuard } from '@guards/owner.guard';
import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { UserEntity } from 'optimus-package';

function createMockContext(user: Nullable<UserEntity>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('OwnerGuard', () => {
  let guard: OwnerGuard;

  beforeEach(() => {
    guard = new OwnerGuard();
  });

  describe('canActivate', () => {
    it('should allow access for owner role', () => {
      const user = createUserEntity({ role: 'owner' });
      const context = createMockContext(user);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access for admin role', () => {
      const user = createUserEntity({ role: 'admin' });
      const context = createMockContext(user);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access for user role', () => {
      const user = createUserEntity({ role: 'user' });
      const context = createMockContext(user);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny access for unauthenticated user', () => {
      const context = createMockContext(null);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
