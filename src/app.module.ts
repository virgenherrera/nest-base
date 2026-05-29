import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [CoreModule, HealthModule],
})
export class AppModule {}
