import {
  Controller,
  Get,
  Logger,
  OnApplicationBootstrap,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';

import { plainToInstance } from 'class-transformer';
import { AppConfig } from '../../config';
import { InjectConfig } from '../decorators';
import { GetHealthQueryDto, GetHealthResponseDto } from '../dto';

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
    description: 'Checks the health of the service status report.',
    summary: 'Perform a health check of the service',
  })
  @ApiOkResponse({
    type: GetHealthResponseDto,
  })
  async getHealth(
    @Query() params: GetHealthQueryDto,
  ): Promise<GetHealthResponseDto> {
    this.logger.log(`Getting service Health.`);
    const res: GetHealthResponseDto = { status: 'OK' };

    if (params.appMeta) {
      const { name, version } = await Promise.resolve(this.appConfig);
      res.appMeta = `${name}@${version}`;
    }

    if (params.uptime) {
      res.uptime = formatDistanceToNow(this.startTime);
    }

    return plainToInstance(GetHealthResponseDto, res);
  }
}
