import { Type } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { z } from 'zod';

import * as ConfigNamespaces from '../../../config';

const ClassNameTokenMap = new Map<string, symbol>();
const dynamicModule = ConfigModule.forRoot({
  cache: true,
  expandVariables: true,
  isGlobal: true,
  load: Object.values(ConfigNamespaces)
    .filter((v: object) => 'create' in v && 'name' in v && 'schema' in v)
    .map((classRef) => {
      const configFactory = registerAs(classRef.name, async () => {
        const { data, success, error } = await classRef.schema.safeParseAsync(
          process.env,
        );

        if (!success) {
          console.error('\n❌ Invalid environment configuration detected.\n');
          console.error(z.prettifyError(error));
          console.error(
            '\n💡 Fix: Ensure all required variables are defined in your environment or .env file at the project root.\n',
          );
          process.exit(1);
        }

        const instance = Object.assign(new classRef(), data);
        Object.seal(instance);
        Object.freeze(instance);

        return instance;
      });

      ClassNameTokenMap.set(classRef.name, configFactory.KEY as symbol);

      return configFactory;
    }),
});

export const AppConfigModule: ReturnType<typeof ConfigModule.forRoot> & {
  getToken(cls: Type): symbol | undefined;
} = Object.assign(dynamicModule, {
  getToken(cls: Type) {
    return ClassNameTokenMap.get(cls.name);
  },
});
