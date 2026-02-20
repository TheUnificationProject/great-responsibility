import { AUTH_COOKIE_NAME } from '@modules/auth/auth.constants';
import { ConfigService } from '@modules/config/config.service';
import { RedisService } from '@modules/redis/redis.service';
import { RedisStore } from 'connect-redis';
import session from 'express-session';

export const sessionMiddleware = (
  configService: ConfigService,
  redisService: RedisService,
) =>
  session({
    name: AUTH_COOKIE_NAME,
    store: new RedisStore({
      client: redisService.client,
      prefix: 'sess:',
    }),
    secret: configService.get('SECRET_KEY'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: configService.get('NODE_ENV') === 'production',
      signed: true,
      sameSite:
        configService.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
    },
  });
