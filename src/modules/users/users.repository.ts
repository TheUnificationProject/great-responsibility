import { AbstractRepository } from '@modules/database/abstract.repository';
import { DatabaseService } from '@modules/database/database.service';
import { Injectable } from '@nestjs/common';
import { eq, or, SQL } from 'drizzle-orm';
import { UserEntity, UserSchema, userSchema } from 'optimus-package';

@Injectable()
export class UsersRepository extends AbstractRepository<
  UserSchema,
  UserEntity
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, userSchema);
  }

  public async findByLogin(login: string): Promise<Nullable<UserEntity>> {
    return this.findOne(
      or(
        eq(userSchema.username, login),
        eq(userSchema.email, login),
      ) as SQL<UserSchema>,
    );
  }
}
