import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import {
  GlobalValidationPipeProvider,
  LogRequestInterceptorProvider,
  PagedResultsInterceptorProvider,
} from './common/providers';

@Module({
  imports: [CommonModule],
  providers: [
    GlobalValidationPipeProvider,
    LogRequestInterceptorProvider,
    PagedResultsInterceptorProvider,
  ],
})
export class AppModule {}
