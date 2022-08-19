import { ApiProperty } from '@nestjs/swagger';

export class SystemHealth {
  @ApiProperty() cpuUsage: string;
  @ApiProperty() memoryUsage: string;
  @ApiProperty() uptime: string;
  @ApiProperty() uptimeSince: string;

  constructor(args: Partial<SystemHealth>) {
    Object.assign(this, args);
  }
}
