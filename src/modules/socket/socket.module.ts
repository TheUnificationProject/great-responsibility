import { RedisModule } from '@modules/redis/redis.module';
import { SocketService } from '@modules/socket/socket.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [RedisModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
