import { Controller, Get, OnApplicationBootstrap, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { formatDistanceToNow } from 'date-fns';

import { Logger } from '../../common/decorators';
import { GetHealthQueryDto, GetHealthResponseDto } from '../dto';

@Controller('health')
@ApiTags('health')
export class HealthController implements OnApplicationBootstrap {
  @Logger() private readonly logger: Logger;

  private startTime: Date;

  onApplicationBootstrap() {
    this.startTime = new Date();
  }

  @Get()
  @ApiOperation({
    summary: 'Perform a health check of the service',
    description: 'Checks the health of the service status report.',
  })
  @ApiOkResponse({
    type: GetHealthResponseDto,
  })
  getHealth(@Query() params: GetHealthQueryDto): GetHealthResponseDto {
    this.logger.log(`Getting service Health.`);

    return plainToInstance(GetHealthResponseDto, {
      uptime: !params.uptime ? undefined : formatDistanceToNow(this.startTime),
    });
  }
}
