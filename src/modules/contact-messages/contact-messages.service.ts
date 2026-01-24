import { ContactMessagesRepository } from '@modules/contact-messages/contact-messages.repository';
import { Injectable } from '@nestjs/common';
import { ContactMessageEntity } from 'optimus-package';

@Injectable()
export class ContactMessagesService {
  constructor(
    private readonly contactMessagesRepository: ContactMessagesRepository,
  ) {}

  public async createContactMessage(
    data: Omit<ContactMessageEntity, 'uuid' | 'createdAt'>,
  ): Promise<ContactMessageEntity> {
    const contactMessage = await this.contactMessagesRepository.create({
      profileUuid: data.profileUuid,
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organizationName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message,
      lang: data.lang,
    });

    return contactMessage;
  }
}
