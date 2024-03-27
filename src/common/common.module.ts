import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controllers';
import { CpuHealthIndicator, UptimeHealthIndicator } from './indicators';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
  providers: [CpuHealthIndicator, UptimeHealthIndicator],
})
export class CommonModule {}
