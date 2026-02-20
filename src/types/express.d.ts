import { UserEntity } from 'optimus-package';

declare module 'express' {
  interface Request {
    user: Nullable<UserEntity>;
  }
}

declare module 'express-session' {
  interface SessionData {
    rememberMe?: boolean;
    regenerationCounter?: number;
  }
}
