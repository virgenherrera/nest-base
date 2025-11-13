import { Type } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { env } from 'node:process';

import * as ConfigNamespaces from '../../config';

const ClassNameTokenMap = new Map<string, symbol>();
const dynamicModule = ConfigModule.forRoot({
  cache: true,
  expandVariables: true,
  isGlobal: true,
  load: Object.values(ConfigNamespaces)
    .filter((fn) => /^class\s/.test(fn.toString()))
    .map(<T>(classConstructor: ClassConstructor<T>) => {
      const configFactory = registerAs(classConstructor.name, async () => {
        const instance = plainToInstance(classConstructor, env, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        });

        const errors = await validate(instance as object, {
          forbidNonWhitelisted: true,
          stopAtFirstError: false,
          whitelist: true,
        });

        if (errors.length) {
          const msgTitle = `Environment validation error found!`;

          console.warn(msgTitle + '\n' + '='.repeat(msgTitle.length));
          errors.forEach(({ target, constraints }) => {
            console.log('in:', target);
            console.log('errors:', constraints);
          });
          console.trace();

          throw new Error(msgTitle, { cause: errors });
        }

        Object.seal(instance);
        Object.freeze(instance);

        return instance;
      });

      ClassNameTokenMap.set(classConstructor.name, configFactory.KEY as symbol);

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
