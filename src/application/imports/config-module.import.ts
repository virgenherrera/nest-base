import { ConfigFactory, ConfigModule } from '@nestjs/config';

import * as configs from '../../config';

export class AppConfigModule {
  static forRoot() {
    return ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: Object.values(configs).filter(
        fn => !/^class\s/.test(fn.toString()),
      ) as Array<ConfigFactory>,
    });
  }
}
