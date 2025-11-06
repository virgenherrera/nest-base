import { Inject, Type } from '@nestjs/common';

import { AppConfigModule } from '../imports';

export function InjectConfig<T extends Type>(configCls: T): ParameterDecorator {
  const registryKey = AppConfigModule.getToken(configCls);

  return Inject(registryKey);
}
