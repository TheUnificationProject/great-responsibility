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
    const { limit, offset } =
      this.profilesRepository.getPaginationParams(query);

    const [profiles, count] = await Promise.all([
      this.profilesRepository.findMany({}, { limit, offset }),
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

  public async updateProfile(
    profileUuid: string,
    data: Partial<
      Omit<ProfileEntity, 'uuid' | 'linkedIn' | 'gitHub' | 'updatedAt'>
    >,
  ): Promise<void> {
    const profile: Nullable<ProfileEntity> =
      await this.profilesRepository.findOne({
        uuid: profileUuid,
      });
    if (!profile) throw new NotFoundException('Profile not found');

    const newData: Partial<ProfileEntity> = {};
    if (data.firstName) newData.firstName = data.firstName;
    if (data.lastName) newData.lastName = data.lastName;
    if (data.title !== undefined) newData.title = data.title || null;
    if (data.biography !== undefined)
      newData.biography = data.biography || null;
    if (data.birthDate !== undefined)
      newData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    if (data.location !== undefined) newData.location = data.location || null;
    if (data.contactEmail !== undefined)
      newData.contactEmail = data.contactEmail || null;
    if (data.contactPhoneNumber !== undefined)
      newData.contactPhoneNumber = data.contactPhoneNumber || null;

    await this.profilesRepository.update({ uuid: profile.uuid }, newData);
  }

  public async updateLinkedInProfile(
    profileUuid: string,
    data: Partial<
      Omit<LinkedInProfileEntity, 'uuid' | 'profileUuid' | 'updatedAt'>
    >,
  ): Promise<void> {
    const [profile, linkedInProfile] = await Promise.all([
      this.profilesRepository.findOne({ uuid: profileUuid }),
      this.linkedInProfileRepository.findOne({ profileUuid }),
    ]);

    if (!profile) throw new NotFoundException('Profile not found');
    if (!linkedInProfile)
      throw new NotFoundException('LinkedIn profile not found');

    const newData: Partial<LinkedInProfileEntity> = {};
    if (data.slug !== undefined) newData.slug = data.slug || null;

    await this.linkedInProfileRepository.update(
      { uuid: linkedInProfile.uuid },
      newData,
    );
  }

  public async updateGitHubProfile(
    profileUuid: string,
    data: Partial<
      Omit<GitHubProfileEntity, 'uuid' | 'profileUuid' | 'updatedAt'>
    >,
  ): Promise<void> {
    const [profile, gitHubProfile] = await Promise.all([
      this.profilesRepository.findOne({ uuid: profileUuid }),
      this.gitHubProfileRepository.findOne({ profileUuid }),
    ]);

    if (!profile) throw new NotFoundException('Profile not found');
    if (!gitHubProfile) throw new NotFoundException('GitHub profile not found');

    const newData: Partial<GitHubProfileEntity> = {};
    if (data.username !== undefined) newData.username = data.username || null;

    await this.gitHubProfileRepository.update(
      { uuid: gitHubProfile.uuid },
      newData,
    );
  }

  public static formatProfile(profile: ProfileEntity): Profile {
    const formatted: Profile = {
      uuid: profile.uuid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: ProfilesService.formatFullName(
        profile.firstName,
        profile.lastName,
      ),
      title: profile.title,
      biography: profile.biography,
      age: profile.birthDate
        ? ProfilesService.calculateAge(profile.birthDate)
        : null,
      location: profile.location,
      contactEmail: profile.contactEmail,
      contactPhoneNumber: profile.contactPhoneNumber,
      linkedIn: {
        profileUrl: profile.linkedIn.slug
          ? ProfilesService.formatLinkedInProfileUrl(profile.linkedIn.slug)
          : null,
      },
      gitHub: {
        profileUrl: profile.gitHub.username
          ? ProfilesService.formatGitHubProfileUrl(profile.gitHub.username)
          : null,
      },
      updatedAt: profile.updatedAt,
    };

    return formatted;
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
