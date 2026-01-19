import { setupSwagger } from '@/swagger';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { AppModule } from '@modules/app.module';
import { ConfigService } from '@modules/config/config.service';
import { NestFactory } from '@nestjs/core';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'production'
        ? [/^https:\/\/([a-z0-9-]+\.)*clement-fossorier\.fr$/]
        : true,
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app);

  const port = process.env.PORT ?? DEFAULT_PORT;
  if (configService.get('NODE_ENV') === 'production') await app.listen(port);
  else await app.listen(port, '0.0.0.0'); // Allows to connect from other devices on the same network
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
