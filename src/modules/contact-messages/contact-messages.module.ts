import { ContactMessagesRepository } from '@modules/contact-messages/contact-messages.repository';
import { ContactMessagesService } from '@modules/contact-messages/contact-messages.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [ContactMessagesService, ContactMessagesRepository],
  imports: [],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {}
