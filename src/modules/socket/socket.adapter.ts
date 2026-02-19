import { AUTH_COOKIE_NAME } from '@modules/auth/auth.constants';
import { ConfigService } from '@modules/config/config.service';
import { RedisService } from '@modules/redis/redis.service';
import { UsersService } from '@modules/users/users.service';
import type { INestApplicationContext } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createHmac, timingSafeEqual } from 'crypto';
import type { UserEntity } from 'optimus-package';
import type { ServerOptions } from 'socket.io';
import type * as Types from './socket.types';

export class SocketAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketAdapter.name);
  private readonly configService: ConfigService;
  private readonly redisService: RedisService;
  private readonly usersService: UsersService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
    this.redisService = app.get(RedisService);
    this.usersService = app.get(UsersService);
  }

  createIOServer(port: number, options?: ServerOptions): Types.WsServer {
    const isProd = this.configService.get('NODE_ENV') === 'production';

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: isProd
          ? [/^https:\/\/([a-z0-9-]+\.)*clement-fossorier\.fr$/]
          : true,
        credentials: true,
      },
    }) as Types.WsServer;

    this.attachRedisAdapter(server);

    server.use((socket: Types.Socket, next: (err?: Error) => void) => {
      this.extractUserFromSocket(socket)
        .then((user) => {
          socket.data.user = user;
          next();
        })
        .catch(() => {
          socket.data.user = null;
          next();
        });
    });

    return server;
  }

  private attachRedisAdapter(server: Types.WsServer): void {
    const pubClient = this.redisService.client.duplicate();
    const subClient = this.redisService.client.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        server.adapter(createAdapter(pubClient, subClient));
        this.logger.log('Socket.io Redis adapter attached');
      })
      .catch((err: unknown) => {
        this.logger.error('Failed to attach Socket.io Redis adapter', err);
      });
  }

  private async extractUserFromSocket(
    socket: Types.Socket,
  ): Promise<Nullable<UserEntity>> {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return null;

    const cookies = this.parseCookies(cookieHeader);

    let rawSessionId = cookies[AUTH_COOKIE_NAME];
    if (!rawSessionId) return null;

    rawSessionId = decodeURIComponent(rawSessionId);

    // express-session signed cookies have the format s:<value>.<signature>
    if (rawSessionId.startsWith('s:')) {
      const unsigned = this.unsignCookie(
        rawSessionId.slice(2),
        this.configService.get('SECRET_KEY'),
      );
      if (unsigned === false) return null;
      rawSessionId = unsigned;
    }

    const sessionData = await this.redisService.client.get(
      `sess:${rawSessionId}`,
    );
    if (!sessionData) return null;

    const session = JSON.parse(sessionData) as {
      passport?: { user?: string };
    };

    const userUuid = session?.passport?.user;
    if (!userUuid) return null;

    try {
      return await this.usersService.getUserByUuid(userUuid);
    } catch {
      return null;
    }
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    for (const pair of cookieHeader.split(';')) {
      const idx = pair.indexOf('=');
      if (idx === -1) continue;

      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();

      if (key) cookies[key] = val;
    }

    return cookies;
  }

  private unsignCookie(signedValue: string, secret: string): string | false {
    const dotIndex = signedValue.lastIndexOf('.');
    if (dotIndex === -1) return false;

    const value = signedValue.substring(0, dotIndex);

    const expected =
      value +
      '.' +
      createHmac('sha256', secret)
        .update(value)
        .digest('base64')
        .replace(/=+$/, '');

    const expectedBuf = Buffer.from(expected);
    const signedBuf = Buffer.from(signedValue);

    if (expectedBuf.length !== signedBuf.length) return false;

    return timingSafeEqual(expectedBuf, signedBuf) ? value : false;
  }
}
