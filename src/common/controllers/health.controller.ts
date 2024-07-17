import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { formatDistanceToNow } from 'date-fns';

import { GetHealthDocs } from '../docs';

@Controller('health')
@ApiTags('health')
export class HealthController implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);
  private startTime: Date;

  constructor(private readonly health: HealthCheckService) {}

  onModuleInit() {
    this.startTime = new Date();
  }

  @GetHealthDocs()
  async getHealth(): Promise<HealthCheckResult> {
    this.logger.log(`Getting service Health.`);

    const uptime = formatDistanceToNow(this.startTime, { addSuffix: false });

    return this.health.check([
      async () => ({
        uptime: {
          status: 'up',
          duration: uptime,
        },
      }),
    ]);
  }
}
