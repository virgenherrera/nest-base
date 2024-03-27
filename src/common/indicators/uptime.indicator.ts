import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { format, formatDistanceToNowStrict, subSeconds } from 'date-fns';
import { AppConfig } from '../../config';

@Injectable()
export class UptimeHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  check(key: 'uptime'): HealthIndicatorResult {
    const appConfig = this.configService.get(AppConfig.name);
    const uptime = process.uptime();
    const isHealthy =
      Boolean(uptime) || ['TEST', 'E2E'].includes(appConfig.environment);
    const uptimeDate = subSeconds(new Date(), process.uptime());
    const formattedUptime = formatDistanceToNowStrict(uptimeDate);
    const uptimeSince = format(uptimeDate, 'yyyy-MM-dd KK:mm:ss bb OOO');

    const result = this.getStatus(key, isHealthy, {
      [key]: formattedUptime,
      uptimeSince,
    });

    if (isHealthy) return result;

    throw new HealthCheckError('Uptime check failed', result);
  }
}
