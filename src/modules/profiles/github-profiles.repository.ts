import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { GitHubProfileEntity } from 'optimus-package';

@Injectable()
export class GitHubProfilesRepository extends EntityRepository<GitHubProfileEntity> {
  constructor(em: EntityManager) {
    super(em, GitHubProfileEntity);
  }
}
