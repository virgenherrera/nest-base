import { Controller, Query } from '@nestjs/common';

import { Logger } from '../decorators';
import { GetHealthDocs } from '../docs';
import { GetHealthQueryDto } from '../dto';
import { SystemHealth } from '../models';
import { DtoValidation } from '../pipes';
import { HealthService } from '../services';

@Controller()
export class HealthController {
  @Logger() private logger: Logger;

  constructor(private healthService: HealthService) {}

  @GetHealthDocs()
  async getHealth(
    @Query(DtoValidation.pipe) query: GetHealthQueryDto,
  ): Promise<SystemHealth> {
    this.logger.log(`Getting service Health.`);

    return await this.healthService.getHealth(query);
  }
}
