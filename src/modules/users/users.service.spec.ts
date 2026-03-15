import { createUserEntity } from '@factories/user.factory';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRole } from 'optimus-package';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    hashSync: jest.fn((password: string) => `hashed_${password}`),
    compareSync: jest.fn(
      (password: string, hash: string) => hash === `hashed_${password}`,
    ),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  wrap: jest.fn().mockReturnValue({ assign: jest.fn() }),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockFlush = jest.fn().mockResolvedValue(undefined);
  const mockPersist = jest.fn().mockReturnValue({ flush: mockFlush });
  const mockEntityManager = { persist: mockPersist, flush: mockFlush };

  beforeEach(async () => {
    mockFlush.mockClear();
    mockPersist.mockClear();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
            findByLogin: jest.fn(),
            create: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get<jest.Mocked<UsersRepository>>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return the user when credentials are valid', async () => {
      const user = createUserEntity({ password: 'hashed_correct' });
      repository.findByLogin.mockResolvedValue(user);

      const result = await service.validateUser('user1', 'correct');

      expect(result).toEqual(user);
      expect(repository.findByLogin).toHaveBeenCalledWith('user1');
    });

    it('should return null when user is not found', async () => {
      repository.findByLogin.mockResolvedValue(null);

      const result = await service.validateUser('unknown', 'pass');

      expect(result).toBeNull();
      expect(repository.findByLogin).toHaveBeenCalledWith('unknown');
    });

    it('should return null when password is invalid', async () => {
      const user = createUserEntity({ password: 'hashed_correct' });
      repository.findByLogin.mockResolvedValue(user);

      const result = await service.validateUser('user1', 'wrong');

      expect(result).toBeNull();
      expect(repository.findByLogin).toHaveBeenCalledWith('user1');
    });
  });

  describe('getUserByUuid', () => {
    it('should return a user when found', async () => {
      const user = createUserEntity({ uuid: 'abc-123' });
      repository.findOne.mockResolvedValue(user);

      const result = await service.getUserByUuid('abc-123');

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ uuid: 'abc-123' });
    });

    it('should throw NotFoundException when user is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getUserByUuid('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((data) => createUserEntity(data));

      const result = await service.createUser({
        username: 'newuser',
        email: 'new@test.com',
        password: 'plaintext',
      });

      expect(result.password).toBe('hashed_plaintext');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'newuser',
          email: 'new@test.com',
          password: 'hashed_plaintext',
        }),
      );
      expect(mockPersist).toHaveBeenCalled();
      expect(mockFlush).toHaveBeenCalled();
    });

    it('should throw BadRequestException for banned username', async () => {
      await expect(
        service.createUser({
          username: 'me',
          email: 'me@test.com',
          password: 'pass',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when username is taken', async () => {
      const existingUser = createUserEntity({ username: 'taken' });
      repository.findOne
        .mockResolvedValueOnce(existingUser) // username check
        .mockResolvedValueOnce(null); // email check

      await expect(
        service.createUser({
          username: 'taken',
          email: 'new@test.com',
          password: 'pass',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email is taken', async () => {
      const existingUser = createUserEntity({ email: 'taken@test.com' });
      repository.findOne
        .mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce(existingUser); // email check

      await expect(
        service.createUser({
          username: 'newuser',
          email: 'taken@test.com',
          password: 'pass',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const user = createUserEntity({ uuid: 'abc' });
      repository.findOne
        .mockResolvedValueOnce(user) // find user by uuid
        .mockResolvedValueOnce(null) // username not taken
        .mockResolvedValueOnce(null); // email not taken

      await service.updateUser('abc', {
        username: 'updated',
        email: 'updated@test.com',
      });

      expect(mockFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser('not-found', {
          username: 'x',
          email: 'x@test.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when username is taken by another user', async () => {
      const user = createUserEntity({ uuid: 'abc' });
      const otherUser = createUserEntity({ uuid: 'other', username: 'taken' });
      repository.findOne
        .mockResolvedValueOnce(user) // find user by uuid
        .mockResolvedValueOnce(otherUser); // username taken by other user

      await expect(
        service.updateUser('abc', {
          username: 'taken',
          email: 'new@test.com',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email is taken by another user', async () => {
      const user = createUserEntity({ uuid: 'abc' });
      const otherUser = createUserEntity({
        uuid: 'other',
        email: 'taken@test.com',
      });
      repository.findOne
        .mockResolvedValueOnce(user) // find user by uuid
        .mockResolvedValueOnce(null) // username not taken
        .mockResolvedValueOnce(otherUser); // email taken by other user

      await expect(
        service.updateUser('abc', {
          username: 'newname',
          email: 'taken@test.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('formatMinimalUser', () => {
    it('should return only uuid and username', () => {
      const user = createUserEntity({ uuid: 'u1', username: 'john' });

      const result = service.formatMinimalUser(user);

      expect(result).toEqual({ uuid: 'u1', username: 'john' });
    });
  });

  describe('formatUser', () => {
    it('should return user without password, email and role', () => {
      const user = createUserEntity();

      const result = service.formatUser(user);

      expect(result).toEqual({
        uuid: user.uuid,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? null,
      });
    });
  });

  describe('formatPrivateUser', () => {
    it('should return user with email and role but without password', () => {
      const user = createUserEntity({ role: UserRole.ADMIN });

      const result = service.formatPrivateUser(user);

      expect(result).toEqual({
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        role: 'admin',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? null,
      });
    });
  });
});
