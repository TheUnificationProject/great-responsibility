import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { SkillEntity, SkillSchema, skillSchema } from 'optimus-package';

@Injectable()
export class SkillsRepository extends AbstractRepository<
  SkillSchema,
  SkillEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, skillSchema);
  }
}
