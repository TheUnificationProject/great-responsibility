import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindAllOptions,
  FindOneOptions,
  FindOptions,
  Loaded,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'optimus-package';

const POPULATE = ['linkedInProfile', 'gitHubProfile'] as const;

@Injectable()
export class ProfilesRepository extends EntityRepository<ProfileEntity> {
  constructor(em: EntityManager) {
    super(em, ProfileEntity);
  }

  override findOne<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    where: FilterQuery<ProfileEntity>,
    options?: FindOneOptions<ProfileEntity, Hint, Fields, Excludes>,
  ): Promise<Loaded<ProfileEntity, Hint, Fields, Excludes> | null> {
    return super.findOne(where, {
      ...options,
      populate: [
        ...POPULATE,
        ...(Array.isArray(options?.populate)
          ? (options.populate as string[])
          : []),
      ] as never,
    });
  }

  override find<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    where: FilterQuery<ProfileEntity>,
    options?: FindOptions<ProfileEntity, Hint, Fields, Excludes>,
  ): Promise<Loaded<ProfileEntity, Hint, Fields, Excludes>[]> {
    return super.find(where, {
      ...options,
      populate: [
        ...POPULATE,
        ...(Array.isArray(options?.populate)
          ? (options.populate as string[])
          : []),
      ] as never,
    });
  }

  override findAll<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    options?: FindAllOptions<ProfileEntity, Hint, Fields, Excludes>,
  ): Promise<Loaded<ProfileEntity, Hint, Fields, Excludes>[]> {
    return super.findAll({
      ...options,
      populate: [
        ...POPULATE,
        ...(Array.isArray(options?.populate)
          ? (options.populate as string[])
          : []),
      ] as never,
    });
  }
}
