import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type * as Types from '../socket.types';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Types.Socket>();

    if (client.data.user?.uuid) return true;

    throw new WsException('User is not authenticated');
  }
}
