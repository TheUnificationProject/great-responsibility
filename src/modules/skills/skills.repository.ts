import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { SkillEntity } from 'optimus-package';

@Injectable()
export class SkillsRepository extends EntityRepository<SkillEntity> {
  constructor(em: EntityManager) {
    super(em, SkillEntity);
  }
}
