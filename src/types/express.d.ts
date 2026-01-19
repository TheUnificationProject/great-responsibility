import { UserEntity } from 'optimus-package';

declare module 'express' {
  interface Request {
    user: Nullable<UserEntity>;
  }
}
