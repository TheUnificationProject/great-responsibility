import { setupSwagger } from '@/swagger';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { rollingMiddleware } from '@middlewares/rolling.middleware';
import { sessionMiddleware } from '@middlewares/session.middleware';
import { AppModule } from '@modules/app.module';
import { ConfigService } from '@modules/config/config.service';
import { RedisService } from '@modules/redis/redis.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import passport from 'passport';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const redisService = app.get(RedisService);

  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'production'
        ? [/^https:\/\/([a-z0-9-]+\.)*clement-fossorier\.fr$/]
        : true,
    credentials: true,
  });

  app.use(sessionMiddleware(configService, redisService));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(rollingMiddleware);

  setupSwagger(app);

  const port = process.env.PORT ?? DEFAULT_PORT;
  if (configService.get('NODE_ENV') === 'production') await app.listen(port);
  else await app.listen(port, '0.0.0.0'); // Allows to connect from other devices on the same network
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
