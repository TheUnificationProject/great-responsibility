import { RequiredEntityData } from '@mikro-orm/core';
import { ContactMessagesRepository } from '@modules/contact-messages/contact-messages.repository';
import { Injectable } from '@nestjs/common';
import { ContactMessageEntity } from 'optimus-package';

@Injectable()
export class ContactMessagesService {
  constructor(
    private readonly contactMessagesRepository: ContactMessagesRepository,
  ) {}

  public async createContactMessage(
    data: RequiredEntityData<ContactMessageEntity>,
  ): Promise<ContactMessageEntity> {
    const contactMessage = this.contactMessagesRepository.create(data);

    await this.contactMessagesRepository
      .getEntityManager()
      .persist(contactMessage)
      .flush();

    return contactMessage;
  }
}
