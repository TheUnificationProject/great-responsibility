import { setupSwagger } from '@/swagger';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { AppModule } from '@modules/app.module';
import { AUTH_COOKIE_NAME } from '@modules/auth/auth.constants';
import { ConfigService } from '@modules/config/config.service';
import { RedisService } from '@modules/redis/redis.service';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import passport from 'passport';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const redisService = app.get(RedisService);

  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'production'
        ? [/^https:\/\/([a-z0-9-]+\.)*clement-fossorier\.fr$/]
        : true,
    credentials: true,
  });

  app.use(
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
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  setupSwagger(app);

  const port = process.env.PORT ?? DEFAULT_PORT;
  if (configService.get('NODE_ENV') === 'production') await app.listen(port);
  else await app.listen(port, '0.0.0.0'); // Allows to connect from other devices on the same network
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
