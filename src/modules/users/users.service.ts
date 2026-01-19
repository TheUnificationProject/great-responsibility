import { WhereClause } from '@modules/database/abstract.repository';
import { BANNED_USERNAMES } from '@modules/users/users.constants';
import { UsersRepository } from '@modules/users/users.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { User, UserEntity, userSchema } from 'optimus-package';

const HASH_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async validateUser(
    login: string,
    password: string,
  ): Promise<Nullable<UserEntity>> {
    const user = await this.usersRepository.findOne(
      or(
        eq(userSchema.username, login),
        eq(userSchema.email, login),
      ) as WhereClause<UserEntity>,
    );

    if (
      !user?.password ||
      !UsersService.comparePassword(password, user.password)
    )
      return null;

    return user;
  }

  public async getUserByUuid(uuid: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ uuid });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async createUser(
    data: Omit<
      UserEntity,
      'uuid' | 'role' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<UserEntity> {
    if (BANNED_USERNAMES.includes(data.username))
      throw new BadRequestException(
        `Username "${data.username}" is not allowed`,
      );

    const existingUser = await Promise.all([
      this.usersRepository.findOne({ username: data.username }),
      this.usersRepository.findOne({ email: data.email }),
    ]);

    if (existingUser[0])
      throw new ConflictException(
        `Username ${data.username} is already in use`,
      );
    if (existingUser[1])
      throw new ConflictException(`Email ${data.email} is already in use`);

    const hashedPassword = UsersService.hashPassword(data.password);

    const user = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  public async updateUser(
    uuid: string,
    data: Omit<
      UserEntity,
      'uuid' | 'role' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ uuid });

    if (!user) throw new NotFoundException('User not found');

    const newData: Partial<UserEntity> = {};
    if (data.username) {
      const existingUser = await this.usersRepository.findOne({
        username: data.username,
      });
      if (existingUser?.uuid === uuid)
        throw new BadRequestException('Username is already in use');
      newData.username = data.username;
    }
    if (data.email) {
      const existingUser = await this.usersRepository.findOne({
        email: data.email,
      });
      if (existingUser?.uuid === uuid)
        throw new BadRequestException('Email is already in use');
      newData.email = data.email;
    }

    await this.usersRepository.update({ uuid }, newData);
  }

  public formatUser(user: UserEntity): User {
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

  private static hashPassword(password: string): string {
    return bcrypt.hashSync(password, HASH_ROUNDS);
  }

  private static comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
