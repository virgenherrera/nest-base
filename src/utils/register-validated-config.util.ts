import { registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export type RegisterValidatedConfigArgs = Parameters<
  typeof registerValidatedConfig
>[0][];

export function registerValidatedConfig<T>(
  cfgDecoratedCls: ClassConstructor<T>,
): ReturnType<typeof registerAs> {
  return registerAs(cfgDecoratedCls.name, (): T => {
    const instance = plainToInstance(cfgDecoratedCls, new cfgDecoratedCls(), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    const errors = validateSync(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const detailedErrors = errors.reduce(
        (acc, error) =>
          `${acc}${'\n'} property:"${error.property}" with value:"${error.value}" <constraints ${Object.entries(error.constraints).join(' | ')}>`,
        cfgDecoratedCls.name,
      );

      throw new TypeError(detailedErrors);
    }

    Object.seal(instance);
    Object.freeze(instance);

    return instance;
  });
}
