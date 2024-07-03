import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppConfigModule } from '../imports';
import { HealthController } from './controllers';

@Global()
@Module({
  imports: [AppConfigModule.forRoot(), TerminusModule],
  controllers: [HealthController],
})
export class CommonModule {}
