import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import * as AppProviders from './common/providers';
import { AppConfigModule } from './imports';

@Module({
  imports: [AppConfigModule.forRoot(), CommonModule],
  providers: Object.values(AppProviders),
})
export class AppModule {}
