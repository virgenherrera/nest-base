import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { typeOrmConfig } from './typeorm.config';

export const rootConfigModule: ConfigModuleOptions = {
  isGlobal: true,
  load: [typeOrmConfig],
};
