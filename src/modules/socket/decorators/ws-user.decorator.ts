import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { UserEntity } from 'optimus-package';
import type * as Types from '../socket.types';

export const WsUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Nullable<UserEntity> => {
    const client = context.switchToWs().getClient<Types.Socket>();
    return client.data.user;
  },
);
