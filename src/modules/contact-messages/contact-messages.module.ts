import { ContactMessagesRepository } from '@modules/contact-messages/contact-messages.repository';
import { ContactMessagesService } from '@modules/contact-messages/contact-messages.service';
import { DatabaseModule } from '@modules/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  providers: [ContactMessagesService, ContactMessagesRepository],
  imports: [DatabaseModule],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {}
