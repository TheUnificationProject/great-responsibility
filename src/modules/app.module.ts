import { AppController } from '@modules/app.controller';
import { ConfigModule } from '@modules/config/config.module';
import { ContactMessagesModule } from '@modules/contact-messages/contact-messages.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppController],
  imports: [ConfigModule, ProfilesModule, ContactMessagesModule],
})
export class AppModule {}
