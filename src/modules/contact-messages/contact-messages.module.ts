import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContactMessagesRepository } from '@modules/contact-messages/contact-messages.repository';
import { ContactMessagesService } from '@modules/contact-messages/contact-messages.service';
import { Module } from '@nestjs/common';
import { ContactMessageEntity } from 'optimus-package';

@Module({
  providers: [ContactMessagesService, ContactMessagesRepository],
  imports: [MikroOrmModule.forFeature([ContactMessageEntity])],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {}
