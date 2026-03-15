import { createUserEntity } from '@factories/user.factory';
import { LocalStrategy } from '@modules/auth/strategies/local.strategy';
import { UsersService } from '@modules/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: UsersService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get(LocalStrategy);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return the user when credentials are valid', async () => {
      const user = createUserEntity();
      usersService.validateUser.mockResolvedValue(user);

      const result = await strategy.validate(user.username, 'password');

      expect(usersService.validateUser).toHaveBeenCalledWith(
        user.username,
        'password',
      );
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      usersService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate('unknown', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
