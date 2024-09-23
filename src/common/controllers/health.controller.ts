import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { formatDistanceToNow } from 'date-fns';

import { plainToInstance } from 'class-transformer';
import { GetHealthDocs } from '../docs';
import { GetHealthResponseDto } from '../dto';

@Controller('health')
@ApiTags('health')
export class HealthController {
  private readonly logger = new Logger(this.constructor.name);
  private readonly startTime = new Date();

  @GetHealthDocs()
  async getHealth(): Promise<GetHealthResponseDto> {
    this.logger.log(`Getting service Health.`);

    return plainToInstance(GetHealthResponseDto, {
      uptime: formatDistanceToNow(this.startTime, { addSuffix: false }),
    });
  }
}
