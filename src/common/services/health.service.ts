import { Injectable, Logger } from '@nestjs/common';
import { format, formatDistanceToNowStrict, subSeconds } from 'date-fns';
import { cpus as getCpuInfo } from 'os';
import { promisify } from 'util';
import { byteLengthHumanize } from '../../utils';
import { GetHealthQueryDto } from '../dto';
import { SystemHealth } from '../models';

@Injectable()
export class HealthService {
  private logger = new Logger(this.constructor.name);

  async getHealth(dto: GetHealthQueryDto) {
    this.logger.log(`getting service Health`);

    const args: Partial<SystemHealth> = { ...this.getUptimes() };

    if (dto.cpuUsage) args.cpuUsage = await this.getCpuUsage();
    if (dto.memoryUsage) args.memoryUsage = this.getMemoryUsage();

    return new SystemHealth(args);
  }

  private getUptimes() {
    const uptimeDate = subSeconds(new Date(), process.uptime());
    const uptime = formatDistanceToNowStrict(uptimeDate);
    const uptimeSince = format(uptimeDate, 'yyyy-MM-dd KK:mm:ss OOO');

    return { uptime, uptimeSince };
  }

  private getMemoryUsage() {
    const { heapUsed } = process.memoryUsage();

    return byteLengthHumanize(heapUsed);
  }

  private async getCpuUsage() {
    const setTimeoutPromise = promisify(setTimeout);
    const { idle: startIdle, total: startTotal } = this.getCPUInfo();

    await setTimeoutPromise(500);

    const { idle: endIdle, total: endTotal } = this.getCPUInfo();
    const idle = endIdle - startIdle;
    const total = endTotal - startTotal;
    const percentage = idle / total;

    return `${percentage.toFixed(2)}%`;
  }

  private getCPUInfo() {
    const cpusInfo = getCpuInfo();
    let idle = 0;

    const total = cpusInfo.reduce((sum, cpuInfo) => {
      const cpuTimes = Object.values(cpuInfo.times);
      const cpuTimesSum = cpuTimes.reduce((sum, value) => sum + value, 0);

      idle += cpuInfo.times.idle;

      return sum + cpuTimesSum;
    }, 0);

    return { idle, total };
  }
}
