import { Controller } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

import { ApiTags } from '@nestjs/swagger';

import { Logger } from '../decorators';
import { GetHealthDocs } from '../docs';
import { CpuHealthIndicator, UptimeHealthIndicator } from '../indicators';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Logger() private logger: Logger;

  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly cpuHealthIndicator: CpuHealthIndicator,
    private readonly uptimeHealthIndicator: UptimeHealthIndicator,
  ) {}

  @GetHealthDocs()
  async getHealth(): Promise<HealthCheckResult> {
    this.logger.log(`Getting service Health.`);

    return await this.health.check([
      () => this.uptimeHealthIndicator.check('uptime'),
      () => this.cpuHealthIndicator.check('cpu'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
