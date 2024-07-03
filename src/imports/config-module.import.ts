import { ConfigModule } from '@nestjs/config';

import { appConfig } from '../config';

export class AppConfigModule {
  static forRoot() {
    return ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig],
    });
  }
}
