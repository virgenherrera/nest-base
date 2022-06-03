import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreController } from './controllers/core.controller';
import { EnvConfigService, HealthService } from './services';

@Module({
  controllers: [CoreController],
  exports: [EnvConfigService],
  imports: [ConfigModule],
  providers: [EnvConfigService, HealthService],
})
export class CoreModule {}
