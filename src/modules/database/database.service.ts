import { ConfigService } from '@modules/config/config.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createDrizzleClient, DrizzleClient } from 'optimus-package';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly client: DrizzleClient;

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.get('DATABASE_URL'),
      ssl: this.configService.get('DATABASE_SSL_MODE')
        ? { rejectUnauthorized: false }
        : false,
    });

    this.client = createDrizzleClient(this.pool);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
