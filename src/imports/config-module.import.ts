import { ConfigModule } from '@nestjs/config';

import { AppConfig } from '../config';
import {
  registerValidatedConfig,
  RegisterValidatedConfigArgs,
} from '../utils/register-validated-config.util';

export class AppConfigModule {
  static forRoot() {
    return ConfigModule.forRoot({
      isGlobal: true,
      load: AppConfigModule.EnvNamespaces.map(registerValidatedConfig),
    });
  }
  static readonly EnvNamespaces: RegisterValidatedConfigArgs = [AppConfig];
}
