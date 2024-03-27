import { ConfigModule } from '@nestjs/config';

import { AppConfig } from '../config';
import { registerValidatedConfig } from '../utils';

export class AppConfigModule {
  static forRoot() {
    return ConfigModule.forRoot({
      isGlobal: true,
      load: [registerValidatedConfig(AppConfig)],
    });
  }
}
