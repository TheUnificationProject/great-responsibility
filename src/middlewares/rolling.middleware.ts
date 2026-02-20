import { REMEMBER_ME_SESSION_TIMEOUT_MS } from '@modules/auth/auth.constants';
import type { NextFunction, Request, Response } from 'express';

export const rollingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.rememberMe === true) {
    const expires = new Date(Date.now() + REMEMBER_ME_SESSION_TIMEOUT_MS);

    req.session.cookie.maxAge = REMEMBER_ME_SESSION_TIMEOUT_MS;
    req.session.cookie.expires = expires;

    req.session.regenerationCounter =
      (req.session.regenerationCounter ?? 0) + 1;

    req.session.save((err) => next(err ?? undefined));
    return;
  }
  next();
};
