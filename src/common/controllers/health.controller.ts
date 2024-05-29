import { Controller, OnModuleInit } from '@nestjs/common';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

import { ApiTags } from '@nestjs/swagger';

import { formatDistanceToNow } from 'date-fns';
import { Logger } from '../decorators';
import { GetHealthDocs } from '../docs';

@Controller('health')
@ApiTags('health')
export class HealthController implements OnModuleInit {
  @Logger() private logger: Logger;
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
