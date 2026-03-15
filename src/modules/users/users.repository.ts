import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'optimus-package';

@Injectable()
export class UsersRepository extends EntityRepository<UserEntity> {
  constructor(em: EntityManager) {
    super(em, UserEntity);
  }

  public async findByLogin(login: string): Promise<Nullable<UserEntity>> {
    return this.findOne({ $or: [{ username: login }, { email: login }] });
  }
}
