import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import * as configMap from '../config';

export type ConfigClassNames = keyof typeof configMap;
type ConfigInstances<T extends ConfigClassNames[]> = {
  [K in T[number]]: (typeof configMap)[K] extends new (
    ...args: any[]
  ) => infer R
    ? R
    : never;
};

export async function getAppConfigForExternalUse<T extends ConfigClassNames[]>(
  ...configClsNames: T
): Promise<ConfigInstances<T>> {
  const context = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  await ConfigModule.envVariablesLoaded;

  const configService = context.get(ConfigService);
  const initialValue = {} as ConfigInstances<T>;
  const configs = configClsNames.reduce((acc, key) => {
    acc[key] = configService.get(key);

    return acc;
  }, initialValue);

  await context.close();

  return configs;
}
