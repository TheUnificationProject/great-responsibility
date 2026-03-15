import { UNAUTHORIZED_MESSAGE } from '@guards/authenticated.guard';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from 'optimus-package';
import { Observable } from 'rxjs';

const ALLOWED_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.OWNER] as const;

const FORBIDDEN_MESSAGE = 'User is not an admin';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user?.uuid)
      throw new UnauthorizedException(UNAUTHORIZED_MESSAGE);

    if (ALLOWED_ROLES.includes(request.user.role as UserRole)) return true;

    throw new ForbiddenException(FORBIDDEN_MESSAGE);
  }
}
