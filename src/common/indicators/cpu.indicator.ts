import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { cpus as getCpuInfo } from 'os';
import { promisify } from 'util';

@Injectable()
export class CpuHealthIndicator extends HealthIndicator {
  async check(key: 'cpu'): Promise<HealthIndicatorResult> {
    // TODO: make come this from config service;
    const { CPU_THRESHOLD = '80' } = process.env;
    const cpuUsage = await this.getCpuUsage();
    const isHealthy = cpuUsage < Number(CPU_THRESHOLD);
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
