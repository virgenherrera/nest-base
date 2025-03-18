import { Module } from '@nestjs/common';

import { HealthController } from './application/controllers';
import { AppConfigModule } from './application/imports';
import {
  GlobalValidationPipeProvider,
  PagedResultsInterceptorProvider,
} from './application/providers';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AppConfigModule.forRoot, CommonModule],
  controllers: [HealthController],
  providers: [GlobalValidationPipeProvider, PagedResultsInterceptorProvider],
})
export class AppModule {}
