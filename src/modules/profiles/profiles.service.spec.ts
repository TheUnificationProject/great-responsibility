import {
  createGitHubProfileEntity,
  createLinkedInProfileEntity,
  createProfileEntity,
} from '@factories/profile.factory';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GitHubProfilesRepository } from './github-profiles.repository';
import { LinkedInProfilesRepository } from './linkedin-profiles.repository';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profilesRepository: jest.Mocked<ProfilesRepository>;
  let linkedInRepository: jest.Mocked<LinkedInProfilesRepository>;
  let gitHubRepository: jest.Mocked<GitHubProfilesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            getPaginationParams: jest.fn().mockReturnValue({
              limit: 25,
              offset: 0,
            }),
          },
        },
        {
          provide: LinkedInProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: GitHubProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProfilesService);
    profilesRepository = module.get(ProfilesRepository);
    linkedInRepository = module.get(LinkedInProfilesRepository);
    gitHubRepository = module.get(GitHubProfilesRepository);
  });

  describe('getProfiles', () => {
    it('should return paginated profiles', async () => {
      const profiles = [createProfileEntity(), createProfileEntity()];
      profilesRepository.findMany.mockResolvedValue(profiles as never);
      profilesRepository.count.mockResolvedValue(2);

      const result = await service.getProfiles({ page: 1 });

      expect(result.data).toEqual(profiles);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 25,
        totalItems: 2,
        totalPages: 1,
      });
    });
  });

  describe('getProfileByUuid', () => {
    it('should return a profile when found', async () => {
      const profile = createProfileEntity({ uuid: 'p-123' });
      profilesRepository.findOne.mockResolvedValue(profile as never);

      const result = await service.getProfileByUuid('p-123');

      expect(result).toEqual(profile);
    });

    it('should throw NotFoundException when not found', async () => {
      profilesRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfileByUuid('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile fields', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      profilesRepository.update.mockResolvedValue([profile] as never);

      await service.updateProfile('p-1', { firstName: 'Updated' });

      expect(profilesRepository.update).toHaveBeenCalledWith(
        { uuid: 'p-1' },
        expect.objectContaining({ firstName: 'Updated' }),
      );
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      profilesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile('not-found', { firstName: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should set nullable fields to null when empty string provided', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      profilesRepository.update.mockResolvedValue([profile] as never);

      await service.updateProfile('p-1', {
        title: '',
        biography: '',
        location: '',
      });

      expect(profilesRepository.update).toHaveBeenCalledWith(
        { uuid: 'p-1' },
        expect.objectContaining({
          title: null,
          biography: null,
          location: null,
        }),
      );
    });
  });

  describe('updateLinkedInProfile', () => {
    it('should update LinkedIn slug', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      const linkedIn = createLinkedInProfileEntity({
        profileUuid: 'p-1',
        uuid: 'li-1',
      });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      linkedInRepository.findOne.mockResolvedValue(linkedIn as never);
      linkedInRepository.update.mockResolvedValue([linkedIn] as never);

      await service.updateLinkedInProfile('p-1', { slug: 'new-slug' });

      expect(linkedInRepository.update).toHaveBeenCalledWith(
        { uuid: 'li-1' },
        { slug: 'new-slug' },
      );
    });

    it('should throw NotFoundException when profile not found', async () => {
      profilesRepository.findOne.mockResolvedValue(null);
      linkedInRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateLinkedInProfile('not-found', { slug: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when LinkedIn profile not found', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      linkedInRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateLinkedInProfile('p-1', { slug: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateGitHubProfile', () => {
    it('should update GitHub username', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      const gitHub = createGitHubProfileEntity({
        profileUuid: 'p-1',
        uuid: 'gh-1',
      });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      gitHubRepository.findOne.mockResolvedValue(gitHub as never);
      gitHubRepository.update.mockResolvedValue([gitHub] as never);

      await service.updateGitHubProfile('p-1', { username: 'newuser' });

      expect(gitHubRepository.update).toHaveBeenCalledWith(
        { uuid: 'gh-1' },
        { username: 'newuser' },
      );
    });

    it('should throw NotFoundException when profile not found', async () => {
      profilesRepository.findOne.mockResolvedValue(null);
      gitHubRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateGitHubProfile('not-found', { username: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when GitHub profile not found', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      gitHubRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateGitHubProfile('p-1', { username: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('formatProfile', () => {
    it('should format profile with full name and URLs', () => {
      const profile = createProfileEntity({
        uuid: 'p-1',
        firstName: 'John',
        lastName: 'Doe',
        linkedIn: createLinkedInProfileEntity({ slug: 'johndoe' }),
        gitHub: createGitHubProfileEntity({ username: 'johndoe' }),
      });

      const result = ProfilesService.formatProfile(profile);

      expect(result.fullName).toBe('John Doe');
      expect(result.linkedIn.profileUrl).toBe(
        'https://www.linkedin.com/in/johndoe',
      );
      expect(result.gitHub.profileUrl).toBe('https://github.com/johndoe');
    });

    it('should return null URLs when slug/username are null', () => {
      const profile = createProfileEntity({
        linkedIn: createLinkedInProfileEntity({ slug: null }),
        gitHub: createGitHubProfileEntity({ username: null }),
      });

      const result = ProfilesService.formatProfile(profile);

      expect(result.linkedIn.profileUrl).toBeNull();
      expect(result.gitHub.profileUrl).toBeNull();
    });

    it('should calculate age when birthDate is set', () => {
      const birthDate = new Date('1990-01-15T00:00:00Z');
      const profile = createProfileEntity({ birthDate });

      const result = ProfilesService.formatProfile(profile);

      expect(result.age).toBeGreaterThanOrEqual(35);
    });

    it('should return null age when birthDate is null', () => {
      const profile = createProfileEntity({ birthDate: null });

      const result = ProfilesService.formatProfile(profile);

      expect(result.age).toBeNull();
    });
  });
});
