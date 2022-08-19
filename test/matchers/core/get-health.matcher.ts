import { SystemHealth } from '../../../src/core/models';

type BaseSystemHealth = Record<
  keyof Pick<SystemHealth, 'uptime' | 'uptimeSince'>,
  any
>;

export const BaseGetHealthMatcher: BaseSystemHealth = {
  uptime: expect.any(String),
  uptimeSince: expect.any(String),
};

export const GetHealthMatcher: Record<keyof SystemHealth, any> = {
  ...BaseGetHealthMatcher,
  cpuUsage: expect.any(String),
  memoryUsage: expect.any(String),
};
