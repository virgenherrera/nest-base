import { SystemHealth } from '../../../src/core/models';

export class GetHealthMatcher implements Record<keyof SystemHealth, any> {
  cpuUsage = expect.any(String);
  memoryUsage = expect.any(String);
  uptime = expect.any(String);
  uptimeSince = expect.any(String);
}
