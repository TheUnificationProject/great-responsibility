import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { ContactMessageEntity, contactMessageSchema } from 'optimus-package';

@Injectable()
export class ContactMessagesRepository extends AbstractRepository<
  typeof contactMessageSchema,
  ContactMessageEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, contactMessageSchema);
  }
}
