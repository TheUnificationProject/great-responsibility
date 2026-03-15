import { createUserEntity } from '@factories/user.factory';
import { SessionSerializer } from '@modules/auth/session.serializer';
import { UsersService } from '@modules/users/users.service';
import { Test } from '@nestjs/testing';
import type { UserEntity } from 'optimus-package';

describe('SessionSerializer', () => {
  let serializer: SessionSerializer;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionSerializer,
        {
          provide: UsersService,
          useValue: {
            getUserByUuid: jest.fn(),
          },
        },
      ],
    }).compile();

    serializer = module.get(SessionSerializer);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('serializeUser', () => {
    it('should call done with null error and the user uuid', () => {
      const user = createUserEntity();
      const done = jest.fn();

      serializer.serializeUser(user, done);

      expect(done).toHaveBeenCalledWith(null, user.uuid);
    });
  });

  describe('deserializeUser', () => {
    it('should call done with null error and the found user', async () => {
      const user = createUserEntity();
      usersService.getUserByUuid.mockResolvedValue(user);
      const done = jest.fn();

      await serializer.deserializeUser(user.uuid, done);

      expect(usersService.getUserByUuid).toHaveBeenCalledWith(user.uuid);
      expect(done).toHaveBeenCalledWith(null, user);
    });

    it('should call done with null error and null when user is not found', async () => {
      usersService.getUserByUuid.mockResolvedValue(
        null as unknown as UserEntity,
      );
      const done = jest.fn();

      await serializer.deserializeUser('unknown-uuid', done);

      expect(done).toHaveBeenCalledWith(null, null);
    });

    it('should call done with the error when getUserByUuid throws', async () => {
      const error = new Error('db error');
      usersService.getUserByUuid.mockRejectedValue(error);
      const done = jest.fn();

      await serializer.deserializeUser('some-uuid', done);

      expect(done).toHaveBeenCalledWith(error, null);
    });
  });
});
