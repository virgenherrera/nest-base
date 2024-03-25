import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controllers';
import { CpuHealthIndicator, UptimeHealthIndicator } from './indicators';
import { EnvironmentService } from './services';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
  providers: [EnvironmentService, CpuHealthIndicator, UptimeHealthIndicator],
  exports: [EnvironmentService],
})
export class CommonModule {}
