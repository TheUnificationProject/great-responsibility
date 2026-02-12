import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import {
  ContactMessageEntity,
  ContactMessageSchema,
  contactMessageSchema,
} from 'optimus-package';

@Injectable()
export class ContactMessagesRepository extends AbstractRepository<
  ContactMessageSchema,
  ContactMessageEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, contactMessageSchema);
  }
}
