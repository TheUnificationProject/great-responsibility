import { MikroORM } from '@mikro-orm/core';
import {
  DEFAULT_GITHUB_PROFILE_DATA,
  DEFAULT_LINKEDIN_PROFILE_DATA,
  DEFAULT_PROFILE_DATA,
} from '@modules/profiles/profiles.constants';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  ProfileEntity,
} from 'optimus-package';

@Injectable()
export class ProfilesSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProfilesSeeder.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    const em = this.orm.em.fork();

    let [profile] = await em.find(ProfileEntity, {}, { limit: 1 });

    if (profile) this.logger.log('Profile already exists, skipping seed');
    else {
      profile = em.create(ProfileEntity, { ...DEFAULT_PROFILE_DATA });
      await em.persist(profile).flush();
      this.logger.log('Profile created successfully', profile);
    }

    let linkedInProfile = await em.findOne(LinkedInProfileEntity, {
      profile: profile.uuid,
    });

    if (linkedInProfile)
      this.logger.log('LinkedIn profile already exists, skipping seed');
    else {
      linkedInProfile = em.create(LinkedInProfileEntity, {
        profile,
        ...DEFAULT_LINKEDIN_PROFILE_DATA,
      });
      await em.persist(linkedInProfile).flush();
      this.logger.log('LinkedIn profile created successfully', linkedInProfile);
    }

    let gitHubProfile = await em.findOne(GitHubProfileEntity, {
      profile: profile.uuid,
    });

    if (gitHubProfile)
      this.logger.log('GitHub profile already exists, skipping seed');
    else {
      gitHubProfile = em.create(GitHubProfileEntity, {
        profile,
        ...DEFAULT_GITHUB_PROFILE_DATA,
      });
      await em.persist(gitHubProfile).flush();
      this.logger.log('GitHub profile created successfully', gitHubProfile);
    }
  }
}
