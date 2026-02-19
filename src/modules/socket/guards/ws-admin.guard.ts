import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { UserRole } from 'optimus-package';
import type * as Types from '../socket.types';

const ALLOWED_ROLES: UserRole[] = ['admin', 'owner'] as const;

@Injectable()
export class WsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Types.Socket>();

    if (client.data.user?.role && ALLOWED_ROLES.includes(client.data.user.role))
      return true;

    throw new WsException('User is not an admin');
  }
}
