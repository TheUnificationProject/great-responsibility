import { RequiredEntityData, wrap } from '@mikro-orm/core';
import { GitHubProfilesRepository } from '@modules/profiles/github-profiles.repository';
import { LinkedInProfilesRepository } from '@modules/profiles/linkedin-profiles.repository';
import { ProfilesRepository } from '@modules/profiles/profiles.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GitHubProfileEntity,
  LinkedInProfileEntity,
  PaginatedResult,
  Profile,
  ProfileEntity,
} from 'optimus-package';

const MAX_DATA_PER_PAGE = 25;

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly linkedInProfileRepository: LinkedInProfilesRepository,
    private readonly gitHubProfileRepository: GitHubProfilesRepository,
  ) {}

  public async getProfiles(
    query: {
      limit?: number;
      page?: number;
    } = {},
  ): Promise<PaginatedResult<ProfileEntity>> {
    const limit = Math.min(query.limit ?? MAX_DATA_PER_PAGE, MAX_DATA_PER_PAGE);
    const offset = ((query.page ?? 1) - 1) * limit;

    const [profiles, count] = await Promise.all([
      this.profilesRepository.find({}, { limit, offset }),
      this.profilesRepository.count(),
    ]);

    return {
      data: profiles,
      pagination: {
        page: query.page ?? 1,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  public async getProfileByUuid(profileUuid: string): Promise<ProfileEntity> {
    const profile = await this.profilesRepository.findOne({
      uuid: profileUuid,
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  public async updateProfile(
    profileUuid: string,
    data: Partial<RequiredEntityData<ProfileEntity>>,
  ): Promise<void> {
    const profile = await this.profilesRepository.findOne({
      uuid: profileUuid,
    });
    if (!profile) throw new NotFoundException('Profile not found');

    wrap(profile).assign(data);

    await this.profilesRepository.getEntityManager().flush();
  }

  public async updateLinkedInProfile(
    profileUuid: string,
    data: Partial<RequiredEntityData<LinkedInProfileEntity>>,
  ): Promise<void> {
    const [profile, linkedInProfile] = await Promise.all([
      this.profilesRepository.findOne({ uuid: profileUuid }),
      this.linkedInProfileRepository.findOne({ profile: profileUuid }),
    ]);

    if (!profile) throw new NotFoundException('Profile not found');
    if (!linkedInProfile)
      throw new NotFoundException('LinkedIn profile not found');

    wrap(linkedInProfile).assign(data);

    await this.linkedInProfileRepository.getEntityManager().flush();
  }

  public async updateGitHubProfile(
    profileUuid: string,
    data: Partial<RequiredEntityData<GitHubProfileEntity>>,
  ): Promise<void> {
    const [profile, gitHubProfile] = await Promise.all([
      this.profilesRepository.findOne({ uuid: profileUuid }),
      this.gitHubProfileRepository.findOne({ profile: profileUuid }),
    ]);

    if (!profile) throw new NotFoundException('Profile not found');
    if (!gitHubProfile) throw new NotFoundException('GitHub profile not found');

    wrap(gitHubProfile).assign(data);

    await this.gitHubProfileRepository.getEntityManager().flush();
  }

  public static formatProfile(profile: ProfileEntity): Profile {
    return {
      uuid: profile.uuid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: ProfilesService.formatFullName(
        profile.firstName,
        profile.lastName,
      ),
      title: profile.title ?? null,
      biography: profile.biography ?? null,
      age: profile.birthDate
        ? ProfilesService.calculateAge(profile.birthDate)
        : null,
      location: profile.location ?? null,
      contactEmail: profile.contactEmail ?? null,
      contactPhoneNumber: profile.contactPhoneNumber ?? null,
      linkedIn: {
        profileUrl: profile.linkedInProfile?.slug
          ? ProfilesService.formatLinkedInProfileUrl(
              profile.linkedInProfile.slug,
            )
          : null,
      },
      gitHub: {
        profileUrl: profile.gitHubProfile?.username
          ? ProfilesService.formatGitHubProfileUrl(
              profile.gitHubProfile.username,
            )
          : null,
      },
      updatedAt: profile.updatedAt,
    };
  }

  private static formatFullName(
    firstName: string,
    lastName: string,
  ): `${string} ${string}` {
    return `${firstName} ${lastName}`;
  }

  private static calculateAge(birthDate: Date): number {
    const now = new Date();
    const birth = new Date(birthDate);

    let age = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const days = now.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      age--;
    }

    return age;
  }

  private static formatLinkedInProfileUrl(slug: string): string {
    return `https://www.linkedin.com/in/${slug}`;
  }

  private static formatGitHubProfileUrl(username: string): string {
    return `https://github.com/${username}`;
  }
}
