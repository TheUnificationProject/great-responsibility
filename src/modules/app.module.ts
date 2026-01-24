import { AppController } from '@modules/app.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule } from '@modules/config/config.module';
import { ContactMessagesModule } from '@modules/contact-messages/contact-messages.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { RedisModule } from '@modules/redis/redis.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,
    ProfilesModule,
    ContactMessagesModule,
    RedisModule,
    AuthModule,
  ],
})
export class AppModule {}
