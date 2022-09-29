import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers';
import { EnvConfigService, HealthService } from './services';

@Module({
  controllers: [HealthController],
  exports: [EnvConfigService],
  imports: [ConfigModule],
  providers: [EnvConfigService, HealthService],
})
export class CommonModule {}
