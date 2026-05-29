import { Inject, Type } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';

export function InjectConfig<T extends Type>(configCls: T): ParameterDecorator {
  const registryKey = getConfigToken(configCls.name);

  return Inject(registryKey);
}
