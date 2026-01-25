import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import {
  LinkedInProfileEntity,
  LinkedInProfileSchema,
  linkedInProfileSchema,
} from 'optimus-package';

@Injectable()
export class LinkedInProfilesRepository extends AbstractRepository<
  LinkedInProfileSchema,
  LinkedInProfileEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, linkedInProfileSchema);
  }
}
