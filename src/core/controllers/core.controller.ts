import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetHealthDocs } from '../docs/get-health.docs';
import { GetHealthQueryDto } from '../dto';
import { CoreRoute } from '../enums';
import { SystemHealth } from '../models';
import { DtoValidation } from '../pipes';
import { HealthService } from '../services';

@Controller()
export class CoreController {
  private logger = new Logger(this.constructor.name);

  constructor(private healthService: HealthService) {}

  @Get(CoreRoute.health)
  @GetHealthDocs()
  async getHealth(
    @Query(DtoValidation.pipe) query: GetHealthQueryDto,
  ): Promise<SystemHealth> {
    this.logger.log(`Getting service Health.`);

    return await this.healthService.getHealth(query);
  }
}
