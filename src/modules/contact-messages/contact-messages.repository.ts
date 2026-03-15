import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ContactMessageEntity } from 'optimus-package';

@Injectable()
export class ContactMessagesRepository extends EntityRepository<ContactMessageEntity> {
  constructor(em: EntityManager) {
    super(em, ContactMessageEntity);
  }
}
