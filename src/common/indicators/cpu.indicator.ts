import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { cpus as getCpuInfo } from 'os';

import { promisify } from 'util';
import { AppConfig } from '../../config';

@Injectable()
export class CpuHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async check(key: 'cpu'): Promise<HealthIndicatorResult> {
    const appConfig = this.configService.get<AppConfig>(AppConfig.name);
    const cpuUsage = await this.getCpuUsage();
    const isHealthy = cpuUsage < appConfig.cpuThreshold;
    const result = this.getStatus(key, isHealthy, {
      [key]: `${cpuUsage.toFixed(2)}%`,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('CPU check failed', result);
  }

  private async getCpuUsage() {
    const setTimeoutPromise = promisify(setTimeout);
    const { idle: startIdle, total: startTotal } = this.getCPUInfo();

    await setTimeoutPromise(500);

    const { idle: endIdle, total: endTotal } = this.getCPUInfo();
    const idle = endIdle - startIdle;
    const total = endTotal - startTotal;
    const percentage = idle / total;

    return percentage;
  }

  private getCPUInfo() {
    const cpusInfo = getCpuInfo();
    let idle = 0;

    const total = cpusInfo.reduce((sum, cpuInfo) => {
      const cpuTimesSum = Object.values(cpuInfo.times).reduce(
        (sum, value) => sum + value,
        0,
      );

      idle += cpuInfo.times.idle;

      return sum + cpuTimesSum;
    }, 0);

    return { idle, total };
  }
}
