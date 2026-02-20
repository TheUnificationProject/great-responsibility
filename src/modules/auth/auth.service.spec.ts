import { createUserEntity } from '@factories/user.factory';
import {
  AUTH_COOKIE_NAME,
  REMEMBER_ME_SESSION_TIMEOUT_MS,
  SESSION_TIMEOUT_MS,
} from '@modules/auth/auth.constants';
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/users.service';
import { Test } from '@nestjs/testing';
import type { Request, Response } from 'express';
import type { PrivateUser } from 'optimus-package';

type ErrCallback = (err?: Nullable<Error>) => void;

function createPrivateUser(): PrivateUser {
  const user = createUserEntity();
  return {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

function createMockRequest(
  overrides: Partial<Request> = {},
): jest.Mocked<Request> {
  return {
    user: createUserEntity(),
    login: jest.fn((_user: unknown, cb: ErrCallback) => cb(null)),
    logout: jest.fn((cb: ErrCallback) => cb(null)),
    session: {
      cookie: { maxAge: 0, expires: new Date() },
      destroy: jest.fn((cb: ErrCallback) => cb(null)),
    },
    ...overrides,
  } as unknown as jest.Mocked<Request>;
}

function createMockResponse(): jest.Mocked<Response> {
  return {
    send: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as jest.Mocked<Response>;
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            formatPrivateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should log in the user and send the formatted private user', () => {
      const user = createUserEntity();
      const req = createMockRequest({ user });
      const res = createMockResponse();
      const formatted = createPrivateUser();
      usersService.formatPrivateUser.mockReturnValue(formatted);

      service.signIn(req, res);

      expect(req.login).toHaveBeenCalledWith(user, expect.any(Function));
      expect(usersService.formatPrivateUser).toHaveBeenCalledWith(user);
      expect(res.send).toHaveBeenCalledWith(formatted);
    });

    it('should set session cookie maxAge to SESSION_TIMEOUT_MS when rememberMe is false', () => {
      const req = createMockRequest();
      const res = createMockResponse();
      usersService.formatPrivateUser.mockReturnValue(createPrivateUser());

      service.signIn(req, res, false);

      expect(req.session.cookie.maxAge).toBe(SESSION_TIMEOUT_MS);
    });

    it('should set session cookie maxAge to REMEMBER_ME_SESSION_TIMEOUT_MS when rememberMe is true', () => {
      const req = createMockRequest();
      const res = createMockResponse();
      usersService.formatPrivateUser.mockReturnValue(createPrivateUser());

      service.signIn(req, res, true);

      expect(req.session.cookie.maxAge).toBe(REMEMBER_ME_SESSION_TIMEOUT_MS);
    });

    it('should throw when req.login calls back with an error', () => {
      const error = new Error('login failed');
      const req = createMockRequest();
      (req.login as jest.Mock).mockImplementation(
        (_user: unknown, cb: ErrCallback) => cb(error),
      );
      const res = createMockResponse();

      expect(() => service.signIn(req, res)).toThrow(error);
    });
  });

  describe('signUp', () => {
    it('should create a user, log them in and send the formatted private user', async () => {
      const user = createUserEntity();
      const req = createMockRequest();
      const res = createMockResponse();
      const formatted = createPrivateUser();
      usersService.createUser.mockResolvedValue(user);
      usersService.formatPrivateUser.mockReturnValue(formatted);

      await service.signUp(
        { email: user.email, username: user.username, password: 'secret' },
        req,
        res,
      );

      expect(usersService.createUser).toHaveBeenCalledWith({
        email: user.email,
        username: user.username,
        password: 'secret',
      });
      expect(req.login).toHaveBeenCalledWith(user, expect.any(Function));
      expect(usersService.formatPrivateUser).toHaveBeenCalledWith(user);
      expect(res.send).toHaveBeenCalledWith(formatted);
    });

    it('should throw when req.login calls back with an error', async () => {
      const error = new Error('login failed');
      const user = createUserEntity();
      const req = createMockRequest();
      (req.login as jest.Mock).mockImplementation(
        (_user: unknown, cb: ErrCallback) => cb(error),
      );
      const res = createMockResponse();
      usersService.createUser.mockResolvedValue(user);

      await expect(
        service.signUp(
          { email: user.email, username: user.username, password: 'secret' },
          req,
          res,
        ),
      ).rejects.toThrow(error);
    });

    it('should propagate errors thrown by createUser', async () => {
      const error = new Error('db error');
      usersService.createUser.mockRejectedValue(error);
      const req = createMockRequest();
      const res = createMockResponse();

      await expect(
        service.signUp(
          { email: 'a@b.com', username: 'user', password: 'secret' },
          req,
          res,
        ),
      ).rejects.toThrow(error);
    });
  });

  describe('signOut', () => {
    it('should log out the user, destroy the session and clear the auth cookie', () => {
      const req = createMockRequest();
      const res = createMockResponse();

      service.signOut(req, res);

      expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
      expect(req.session.destroy as jest.Mock).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
      expect(res.send).toHaveBeenCalled();
    });

    it('should throw when req.logout calls back with an error', () => {
      const error = new Error('logout failed');
      const req = createMockRequest();
      (req.logout as jest.Mock).mockImplementation((cb: ErrCallback) =>
        cb(error),
      );
      const res = createMockResponse();

      expect(() => service.signOut(req, res)).toThrow(error);
    });

    it('should throw when session.destroy calls back with an error', () => {
      const error = new Error('destroy failed');
      const req = createMockRequest();
      (req.session.destroy as jest.Mock).mockImplementation((cb: ErrCallback) =>
        cb(error),
      );
      const res = createMockResponse();

      expect(() => service.signOut(req, res)).toThrow(error);
    });
  });
});
