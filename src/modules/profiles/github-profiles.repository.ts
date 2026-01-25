import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import {
  GitHubProfileEntity,
  GitHubProfileSchema,
  gitHubProfileSchema,
} from 'optimus-package';

@Injectable()
export class GitHubProfilesRepository extends AbstractRepository<
  GitHubProfileSchema,
  GitHubProfileEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, gitHubProfileSchema);
  }
}
