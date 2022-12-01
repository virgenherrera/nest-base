import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers';
import { EnvironmentService, HealthService } from './services';

@Module({
  controllers: [HealthController],
  exports: [EnvironmentService],
  imports: [ConfigModule],
  providers: [EnvironmentService, HealthService],
})
export class CommonModule {}
