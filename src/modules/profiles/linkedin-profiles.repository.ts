import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { LinkedInProfileEntity } from 'optimus-package';

@Injectable()
export class LinkedInProfilesRepository extends EntityRepository<LinkedInProfileEntity> {
  constructor(em: EntityManager) {
    super(em, LinkedInProfileEntity);
  }
}
