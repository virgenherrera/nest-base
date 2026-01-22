import {
  Controller,
  Get,
  Logger,
  OnApplicationBootstrap,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';

import { plainToInstance } from 'class-transformer';
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
  @ApiOkResponse({
    description:
      'Health status successfully retrieved. Optional fields are present only when requested via query parameters.',
    type: HealthResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Returned when query parameters fail validation (e.g., non-boolean values).',
  })
  @ApiQuery({
    name: 'appMeta',
    required: false,
    type: Boolean,
    description:
      'When true, includes the package name and version in the response.',
  })
  @ApiQuery({
    name: 'uptime',
    required: false,
    type: Boolean,
    description:
      'When true, includes a human-friendly duration indicating how long the service has been running.',
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

    return plainToInstance(HealthResponseDto, res);
  }
}
