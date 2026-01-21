import { AppController } from '@modules/app.controller';
import { ConfigModule } from '@modules/config/config.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppController],
  imports: [ConfigModule, ProfilesModule],
})
export class AppModule {}
