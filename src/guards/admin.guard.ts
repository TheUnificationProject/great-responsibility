import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from 'optimus-package';
import { Observable } from 'rxjs';

const ALLOWED_ROLES: UserRole[] = ['admin', 'owner'] as const;

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (request.user?.role && ALLOWED_ROLES.includes(request.user.role))
      return true;

    throw new ForbiddenException('User is not an admin');
  }
}
