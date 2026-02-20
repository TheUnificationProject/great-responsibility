import { UNAUTHORIZED_MESSAGE } from '@guards/authenticated.guard';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';

const FORBIDDEN_MESSAGE = 'User is not an owner';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user?.uuid)
      throw new UnauthorizedException(UNAUTHORIZED_MESSAGE);

    if (request.user.role === 'owner') return true;

    throw new ForbiddenException(FORBIDDEN_MESSAGE);
  }
}
