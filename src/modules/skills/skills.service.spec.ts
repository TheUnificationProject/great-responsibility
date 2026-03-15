import { createSkillEntity } from '@factories/skill.factory';
import { FirebaseStorageService } from '@modules/firebase/firebase-storage.service';
import { FileUploadResult } from '@modules/firebase/firebase.types';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SkillCategory } from 'optimus-package';
import { SkillsRepository } from './skills.repository';
import { SkillsService } from './skills.service';

jest.mock('sharp', () => {
  const mockSharp = () => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('webp-data')),
  });
  return { __esModule: true, default: mockSharp };
});

describe('SkillsService', () => {
  let service: SkillsService;
  let repository: jest.Mocked<SkillsRepository>;
  let firebaseStorageService: jest.Mocked<FirebaseStorageService>;

  const mockFlush = jest.fn().mockResolvedValue(undefined);
  const mockPersist = jest.fn().mockReturnValue({ flush: mockFlush });
  const mockEntityManager = { persist: mockPersist };

  beforeEach(async () => {
    mockFlush.mockClear();
    mockPersist.mockClear();

    const module = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: SkillsRepository,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            count: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
          },
        },
        {
          provide: FirebaseStorageService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SkillsService);
    repository = module.get(SkillsRepository);
    firebaseStorageService = module.get(FirebaseStorageService);
  });

  describe('getSkills', () => {
    it('should return paginated skills', async () => {
      const skills = [createSkillEntity(), createSkillEntity()];
      repository.find.mockResolvedValue(skills);
      repository.count.mockResolvedValue(2);

      const result = await service.getSkills({ page: 1 });

      expect(result.data).toEqual(skills);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
        totalItems: 2,
        totalPages: 1,
      });
    });

    it('should filter by categories when provided', async () => {
      repository.find.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.getSkills({
        categories: [SkillCategory.LANGUAGE, SkillCategory.FRAMEWORK],
      });

      expect(repository.find).toHaveBeenCalledWith(
        {
          category: { $in: [SkillCategory.LANGUAGE, SkillCategory.FRAMEWORK] },
        },
        expect.objectContaining({ limit: 50, offset: 0 }),
      );
    });
  });

  describe('createSkill', () => {
    it('should create a skill with generated slug', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => createSkillEntity(data));

      const result = await service.createSkill({
        label: 'TypeScript',
        category: SkillCategory.LANGUAGE,
        iconUrl: null,
      });

      expect(result.label).toBe('TypeScript');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'TypeScript',
          category: SkillCategory.LANGUAGE,
        }),
      );
      expect(mockPersist).toHaveBeenCalled();
      expect(mockFlush).toHaveBeenCalled();
    });

    it('should throw ConflictException when slug already exists', async () => {
      repository.findOne.mockResolvedValue(createSkillEntity());

      await expect(
        service.createSkill({
          label: 'Existing',
          category: SkillCategory.LANGUAGE,
          iconUrl: null,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should upload icon when iconBuffer is provided', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => createSkillEntity(data));
      firebaseStorageService.uploadImage.mockResolvedValue({
        url: 'https://storage.example.com/icon.webp',
      } as FileUploadResult);

      await service.createSkill({
        label: 'WithIcon',
        category: SkillCategory.TOOL,
        iconBuffer: Buffer.from('png-data'),
      });

      expect(firebaseStorageService.uploadImage).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          iconUrl: 'https://storage.example.com/icon.webp',
        }),
      );
    });

    it('should use iconUrl directly when provided', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => createSkillEntity(data));

      await service.createSkill({
        label: 'WithUrl',
        category: SkillCategory.TOOL,
        iconUrl: 'https://example.com/icon.png',
      });

      expect(firebaseStorageService.uploadImage).not.toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          iconUrl: 'https://example.com/icon.png',
        }),
      );
    });
  });

  describe('formatSkill', () => {
    it('should format a skill entity', () => {
      const skill = createSkillEntity({
        slug: 'ts',
        label: 'TypeScript',
        category: SkillCategory.LANGUAGE,
      });

      const result = SkillsService.formatSkill(skill);

      expect(result).toEqual({
        slug: 'ts',
        label: 'TypeScript',
        iconUrl: null,
        category: SkillCategory.LANGUAGE,
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
        deletedAt: null,
      });
    });
  });
});
