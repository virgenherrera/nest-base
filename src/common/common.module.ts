import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controllers';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
})
export class CommonModule {}
