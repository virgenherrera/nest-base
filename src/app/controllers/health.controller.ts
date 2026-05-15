import {
  Controller,
  Get,
  Logger,
  OnApplicationBootstrap,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';
import { ZodResponse } from 'nestjs-zod';

import { AppConfig } from '../../config';
import { InjectConfig } from '../decorators';
import { HealthQueryDto, HealthResponseDto } from '../dto';

@Controller('health')
@ApiTags('health')
export class HealthController implements OnApplicationBootstrap {
  constructor(@InjectConfig(AppConfig) private readonly appConfig: AppConfig) {}

  private readonly logger = new Logger(HealthController.name);

  private startTime: Date;

  onApplicationBootstrap() {
    this.startTime = new Date();
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve service health information',
    description:
      'Returns the service health status and, when requested via query parameters, augments the payload with application metadata and uptime details',
  })
  @ZodResponse({
    status: 200,
    description:
      'Health status successfully retrieved. Optional fields are present only when requested via query parameters.',
    type: HealthResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Returned when query parameters fail validation (e.g., non-boolean values).',
  })
  async getHealth(@Query() params: HealthQueryDto): Promise<HealthResponseDto> {
    this.logger.log(`Getting service Health.`);
    const res: HealthResponseDto = { status: 'OK' };

    if (params.appMeta) {
      const { name, version } = await Promise.resolve(this.appConfig);
      res.appMeta = `${name}@${version}`;
    }

    if (params.uptime) {
      res.uptime = formatDistanceToNow(this.startTime);
    }

    return res;
  }
}
