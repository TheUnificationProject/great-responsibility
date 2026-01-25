import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from 'optimus-package';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    user: UserEntity,
    done: (err: unknown, uuid?: string) => void,
  ): void {
    done(null, user.uuid);
  }

  async deserializeUser(
    uuid: string,
    done: (err: unknown, user: Nullable<UserEntity>) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.getUserByUuid(uuid);

      done(null, user || null);
    } catch (error) {
      done(error, null);
    }
  }
}
