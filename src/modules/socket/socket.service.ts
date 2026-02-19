import { RedisService } from '@modules/redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';

const REDIS_KEY = 'socket:connections';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  constructor(private readonly redisService: RedisService) {}

  async addConnection(userUuid: string): Promise<void> {
    const count = await this.redisService.client.hIncrBy(
      REDIS_KEY,
      userUuid,
      1,
    );
    this.logger.debug(
      `User ${userUuid} connected (${count} active connections)`,
    );
  }

  async removeConnection(userUuid: string): Promise<void> {
    const count = await this.redisService.client.hIncrBy(
      REDIS_KEY,
      userUuid,
      -1,
    );

    if (count <= 0) {
      await this.redisService.client.hDel(REDIS_KEY, userUuid);
      this.logger.debug(`User ${userUuid} fully disconnected`);
    } else {
      this.logger.debug(
        `User ${userUuid} disconnected (${count} active connections)`,
      );
    }
  }

  async isUserOnline(userUuid: string): Promise<boolean> {
    const exists = await this.redisService.client.hExists(REDIS_KEY, userUuid);
    return !!exists;
  }

  async getOnlineUsers(): Promise<string[]> {
    return await this.redisService.client.hKeys(REDIS_KEY);
  }

  async getConnectionCount(userUuid: string): Promise<number> {
    const count = await this.redisService.client.hGet(REDIS_KEY, userUuid);
    return count ? parseInt(count, 10) : 0;
  }
}
