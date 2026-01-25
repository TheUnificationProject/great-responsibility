import {
  AUTH_COOKIE_NAME,
  REMEMBER_ME_SESSION_TIMEOUT_MS,
  SESSION_TIMEOUT_MS,
} from '@modules/auth/auth.constants';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserEntity } from 'optimus-package';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  signIn(req: Request, res: Response, rememberMe?: boolean) {
    return req.login(req.user!, (error) => {
      if (error) throw error;

      if (rememberMe) {
        req.session.cookie.maxAge = REMEMBER_ME_SESSION_TIMEOUT_MS;
        req.session.cookie.expires = new Date(
          Date.now() + REMEMBER_ME_SESSION_TIMEOUT_MS,
        );
      } else {
        req.session.cookie.maxAge = SESSION_TIMEOUT_MS;
        req.session.cookie.expires = new Date(Date.now() + SESSION_TIMEOUT_MS);
      }

      return res.send(this.usersService.formatPrivateUser(req.user!));
    });
  }

  async signUp(
    data: Pick<UserEntity, 'email' | 'username' | 'password'>,
    req: Request,
    res: Response,
  ) {
    const user = await this.usersService.createUser({
      email: data.email,
      username: data.username,
      password: data.password,
    });

    return req.login(user, (error) => {
      if (error) throw error;

      return res.send(this.usersService.formatPrivateUser(user));
    });
  }

  signOut(req: Request, res: Response) {
    return req.logout((error) => {
      if (error) throw error;

      req.session.destroy((error) => {
        if (error) throw error;

        res.clearCookie(AUTH_COOKIE_NAME);
        return res.send();
      });
    });
  }
}
