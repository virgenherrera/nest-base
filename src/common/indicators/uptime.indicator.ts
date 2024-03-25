import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { format, formatDistanceToNowStrict, subSeconds } from 'date-fns';

@Injectable()
export class UptimeHealthIndicator extends HealthIndicator {
  check(key: 'uptime'): HealthIndicatorResult {
    const uptime = process.uptime();
    const isHealthy = Boolean(uptime);
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
