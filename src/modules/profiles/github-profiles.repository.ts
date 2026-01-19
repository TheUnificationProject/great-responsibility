import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { GitHubProfileEntity, gitHubProfileSchema } from 'optimus-package';

@Injectable()
export class GitHubProfilesRepository extends AbstractRepository<
  typeof gitHubProfileSchema,
  GitHubProfileEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, gitHubProfileSchema);
  }
}
