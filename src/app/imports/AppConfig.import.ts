import { Type } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
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
          const formatError = (
            error: ValidationError,
            parent = error.property,
          ): string[] => {
            const scopedPath = parent || error.property;
            const serializedValue = (() => {
              const val =
                error.value ??
                (error.target as Record<string, unknown> | undefined)?.[
                  error.property
                ];
              try {
                const json = JSON.stringify(val);

                return json === undefined ? String(val) : json;
              } catch {
                return String(val);
              }
            })();

            const current =
              error.constraints && Object.keys(error.constraints).length
                ? [
                    `${classConstructor.name}.${scopedPath}: ${Object.values(
                      error.constraints,
                    ).join('; ')} | value: ${serializedValue}`,
                  ]
                : [];

            const children =
              error.children?.flatMap((child) =>
                formatError(child, `${scopedPath}.${child.property}`),
              ) ?? [];

            return [...current, ...children];
          };

          const messages = errors.flatMap((err) => formatError(err));
          const title = `Environment validation error(s) in ${classConstructor.name} class`;
          const body =
            messages.length > 0
              ? messages.join('\n')
              : JSON.stringify(errors, null, 2);

          console.error(`${title}\n${'='.repeat(title.length)}\n${body}\n\n\n`);

          throw new TypeError(`${title}\n${body}`);
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
