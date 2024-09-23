import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '../imports';
import { HealthController } from './controllers';

@Global()
@Module({
  imports: [AppConfigModule.forRoot()],
  controllers: [HealthController],
})
export class CommonModule {}
