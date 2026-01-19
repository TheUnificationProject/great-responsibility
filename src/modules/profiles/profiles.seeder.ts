import { GitHubProfilesRepository } from '@modules/profiles/github-profiles.repository';
import { LinkedInProfilesRepository } from '@modules/profiles/linkedin-profiles.repository';
import {
  DEFAULT_GITHUB_PROFILE_DATA,
  DEFAULT_LINKEDIN_PROFILE_DATA,
  DEFAULT_PROFILE_DATA,
} from '@modules/profiles/profiles.constants';
import { ProfilesRepository } from '@modules/profiles/profiles.repository';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ProfilesSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProfilesSeeder.name);

  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly linkedInProfileRepository: LinkedInProfilesRepository,
    private readonly gitHubProfileRepository: GitHubProfilesRepository,
  ) {}

  async onModuleInit() {
    let profile = await this.profilesRepository.findOne({});

    if (profile) this.logger.log('Profile already exists, skipping seed');
    else {
      profile = await this.profilesRepository.create({
        ...DEFAULT_PROFILE_DATA,
      });

      this.logger.log('Profile created successfully', profile);
    }

    let linkedInProfile = await this.linkedInProfileRepository.findOne({
      profileUuid: profile.uuid,
    });

    if (linkedInProfile)
      this.logger.log('LinkedIn profile already exists, skipping seed');
    else {
      linkedInProfile = await this.linkedInProfileRepository.create({
        profileUuid: profile.uuid,
        ...DEFAULT_LINKEDIN_PROFILE_DATA,
      });

      this.logger.log('LinkedIn profile created successfully', linkedInProfile);
    }

    let gitHubProfile = await this.gitHubProfileRepository.findOne({
      profileUuid: profile.uuid,
    });

    if (gitHubProfile)
      this.logger.log('GitHub profile already exists, skipping seed');
    else {
      gitHubProfile = await this.gitHubProfileRepository.create({
        profileUuid: profile.uuid,
        ...DEFAULT_GITHUB_PROFILE_DATA,
      });

      this.logger.log('GitHub profile created successfully', gitHubProfile);
    }
  }
}
