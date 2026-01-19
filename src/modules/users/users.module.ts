import { DatabaseModule } from '@modules/database/database.module';
import { UsersController } from '@modules/users/users.controller';
import { UsersRepository } from '@modules/users/users.repository';
import { UsersService } from '@modules/users/users.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  imports: [DatabaseModule],
})
export class UsersModule {}
