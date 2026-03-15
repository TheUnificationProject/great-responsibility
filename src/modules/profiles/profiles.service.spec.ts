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

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  wrap: jest.fn().mockReturnValue({ assign: jest.fn() }),
}));

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profilesRepository: jest.Mocked<ProfilesRepository>;
  let linkedInRepository: jest.Mocked<LinkedInProfilesRepository>;
  let gitHubRepository: jest.Mocked<GitHubProfilesRepository>;
  let mockFlush: jest.Mock;

  beforeEach(async () => {
    mockFlush = jest.fn().mockResolvedValue(undefined);

    const module = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue({ flush: mockFlush }),
          },
        },
        {
          provide: LinkedInProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue({ flush: mockFlush }),
          },
        },
        {
          provide: GitHubProfilesRepository,
          useValue: {
            findOne: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue({ flush: mockFlush }),
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
      profilesRepository.find.mockResolvedValue(profiles as never);
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

      await service.updateProfile('p-1', { firstName: 'Updated' });

      expect(mockFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      profilesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile('not-found', { firstName: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLinkedInProfile', () => {
    it('should update LinkedIn slug', async () => {
      const profile = createProfileEntity({ uuid: 'p-1' });
      const linkedIn = createLinkedInProfileEntity({ uuid: 'li-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      linkedInRepository.findOne.mockResolvedValue(linkedIn as never);

      await service.updateLinkedInProfile('p-1', { slug: 'new-slug' });

      expect(linkedInRepository.findOne).toHaveBeenCalledWith({
        profile: 'p-1',
      });
      expect(mockFlush).toHaveBeenCalled();
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
      const gitHub = createGitHubProfileEntity({ uuid: 'gh-1' });
      profilesRepository.findOne.mockResolvedValue(profile as never);
      gitHubRepository.findOne.mockResolvedValue(gitHub as never);

      await service.updateGitHubProfile('p-1', { username: 'newuser' });

      expect(gitHubRepository.findOne).toHaveBeenCalledWith({
        profile: 'p-1',
      });
      expect(mockFlush).toHaveBeenCalled();
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
        linkedInProfile: createLinkedInProfileEntity({
          slug: 'johndoe',
        }) as never,
        gitHubProfile: createGitHubProfileEntity({
          username: 'johndoe',
        }) as never,
      });

      const result = ProfilesService.formatProfile(profile as never);

      expect(result.fullName).toBe('John Doe');
      expect(result.linkedIn.profileUrl).toBe(
        'https://www.linkedin.com/in/johndoe',
      );
      expect(result.gitHub.profileUrl).toBe('https://github.com/johndoe');
    });

    it('should return null URLs when slug/username are null', () => {
      const profile = createProfileEntity({
        linkedInProfile: createLinkedInProfileEntity({
          slug: undefined,
        }) as never,
        gitHubProfile: createGitHubProfileEntity({
          username: undefined,
        }) as never,
      });

      const result = ProfilesService.formatProfile(profile as never);

      expect(result.linkedIn.profileUrl).toBeNull();
      expect(result.gitHub.profileUrl).toBeNull();
    });

    it('should calculate age when birthDate is set', () => {
      const birthDate = new Date('1990-01-15T00:00:00Z');
      const profile = createProfileEntity({ birthDate });

      const result = ProfilesService.formatProfile(profile as never);

      expect(result.age).toBeGreaterThanOrEqual(35);
    });

    it('should return null age when birthDate is null', () => {
      const profile = createProfileEntity({ birthDate: undefined });

      const result = ProfilesService.formatProfile(profile as never);

      expect(result.age).toBeNull();
    });
  });
});
