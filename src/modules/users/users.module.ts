import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersController } from '@modules/users/users.controller';
import { UsersRepository } from '@modules/users/users.repository';
import { UsersService } from '@modules/users/users.service';
import { Module } from '@nestjs/common';
import { UserEntity } from 'optimus-package';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  imports: [MikroOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
