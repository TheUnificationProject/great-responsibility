import {
  AbstractRepository,
  FindOptions,
  WhereClause,
} from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  gitHubProfileSchema,
  linkedInProfileSchema,
  ProfileEntity,
  ProfileSchema,
  profileSchema,
} from 'optimus-package';

@Injectable()
export class ProfilesRepository extends AbstractRepository<
  ProfileSchema,
  ProfileEntity
> {
  protected readonly MAX_DATA_PER_PAGE = 25;

  constructor(databaseService: DatabaseService) {
    super(databaseService, profileSchema);
  }

  override async findMany(
    where?: Nullable<WhereClause<ProfileSchema>>,
    options: FindOptions<true> = {},
  ): Promise<ProfileEntity[]> {
    const { offset, limit } = options;

    const query = this.db
      .select({
        profile: profileSchema,
        linkedIn: linkedInProfileSchema,
        gitHub: gitHubProfileSchema,
      })
      .from(profileSchema)
      .where(and(...this.buildConditions(where)))
      .leftJoin(
        linkedInProfileSchema,
        eq(profileSchema.uuid, linkedInProfileSchema.profileUuid),
      )
      .leftJoin(
        gitHubProfileSchema,
        eq(profileSchema.uuid, gitHubProfileSchema.profileUuid),
      )
      .$dynamic();

    const results = await this.withPagination(query, offset, limit);

    return results.map((result) => ({
      ...result.profile,
      linkedIn: result.linkedIn,
      gitHub: result.gitHub,
    })) as ProfileEntity[];
  }
}
