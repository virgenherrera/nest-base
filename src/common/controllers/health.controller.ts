import { Controller, Get, Query } from '@nestjs/common';
import { Logger } from '../decorators';
import { GetHealthDocs } from '../docs/get-health.docs';
import { GetHealthQueryDto } from '../dto';
import { CommonRoute } from '../enums';
import { SystemHealth } from '../models';
import { DtoValidation } from '../pipes';
import { HealthService } from '../services';

@Controller()
export class HealthController {
  @Logger() private logger: Logger;

  constructor(private healthService: HealthService) {}

  @Get(CommonRoute.health)
  @GetHealthDocs()
  async getHealth(
    @Query(DtoValidation.pipe) query: GetHealthQueryDto,
  ): Promise<SystemHealth> {
    this.logger.log(`Getting service Health.`);

    return await this.healthService.getHealth(query);
  }
}
