import { DynamicModule, Logger, Type } from '@nestjs/common';
import { ConfigModule, getConfigToken, registerAs } from '@nestjs/config';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { env } from 'node:process';

type EnvProvider = () => NodeJS.ProcessEnv | Promise<NodeJS.ProcessEnv>;
type ConfigClass = ClassConstructor<unknown>;
type SafeTransformOptions = Omit<
  ClassTransformOptions,
  'enableImplicitConversion' | 'excludeExtraneousValues'
>;
type SafeValidatorOptions = Omit<
  ValidatorOptions,
  'forbidNonWhitelisted' | 'whitelist'
>;
export type AppConfigModuleOptions = {
  cache?: boolean;
  expandVariables?: boolean;
  isGlobal?: boolean;
  configClasses: [ConfigClass, ...ConfigClass[]];
  envProvider?: EnvProvider;
  transformerOptions?: SafeTransformOptions;
  validatorOptions?: SafeValidatorOptions;
};

type ResolvedAppConfigOptions = {
  cache: boolean;
  expandVariables: boolean;
  isGlobal: boolean;
  configClasses: [ConfigClass, ...ConfigClass[]];
  envProvider: EnvProvider;
  transformerOptions: ClassTransformOptions;
  validatorOptions: ValidatorOptions;
};

export class AppConfigModule {
  private static readonly logger = new Logger(AppConfigModule.name);

  static forRoot(options: AppConfigModuleOptions): DynamicModule {
    const resolved = this.resolveOptions(options);
    const configFactories = this.registerConfigFactories(
      resolved.configClasses,
      resolved,
    );
    const configModule = ConfigModule.forRoot({
      cache: resolved.cache,
      expandVariables: resolved.expandVariables,
      isGlobal: resolved.isGlobal,
      load: configFactories,
    });

    this.logger.log(
      `loaded ${resolved.configClasses.length} config namespace${resolved.configClasses.length > 1 ? 's' : ''}`,
    );

    return {
      module: AppConfigModule,
      imports: [configModule],
      exports: [ConfigModule],
    };
  }

  static getToken(cls: Type): string {
    return getConfigToken(cls.name);
  }

  private static resolveOptions(
    options: AppConfigModuleOptions,
  ): ResolvedAppConfigOptions {
    if (!options.configClasses?.length) {
      throw new TypeError(
        'AppConfigModule.forRoot requires at least one config class.',
      );
    }

    return {
      cache: options.cache ?? false,
      expandVariables: options.expandVariables ?? true,
      isGlobal: options.isGlobal ?? true,
      configClasses: options.configClasses,
      envProvider: options.envProvider ?? (() => env),
      transformerOptions: {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        ...options.transformerOptions,
      },
      validatorOptions: {
        forbidNonWhitelisted: true,
        stopAtFirstError: false,
        whitelist: true,
        ...options.validatorOptions,
      },
    };
  }

  private static registerConfigFactories(
    configClasses: ConfigClass[],
    options: ResolvedAppConfigOptions,
  ): ReturnType<typeof registerAs>[] {
    return configClasses.map((configClass) =>
      this.createConfigFactory(configClass, options),
    );
  }

  private static createConfigFactory<T>(
    classConstructor: ClassConstructor<T>,
    options: ResolvedAppConfigOptions,
  ) {
    const configFactory = registerAs(classConstructor.name, async () => {
      const envSource = await options.envProvider();
      const instance = plainToInstance(classConstructor, envSource, {
        ...options.transformerOptions,
      });
      const errors = await validate(instance as object, {
        ...options.validatorOptions,
      });

      if (errors.length) {
        throw this.buildValidationError(classConstructor, errors);
      }

      Object.seal(instance);
      Object.freeze(instance);

      return instance;
    });

    return configFactory;
  }

  private static buildValidationError(
    classConstructor: ClassConstructor<unknown>,
    errors: Awaited<ReturnType<typeof validate>>,
  ): TypeError {
    const messages = errors.flatMap(
      (err) =>
        `\t${err.property}: invalid value provided ${err.value} -> ${Object.values(err.constraints!).join('; ')}`,
    );
    const title = `Configuration validation error(s) in class "${classConstructor.name}"`;
    const body =
      messages.length > 0
        ? messages.join('\n')
        : JSON.stringify(errors, null, 2);
    const footer =
      'Verify the values provided via environment variables or your .env file.';

    return new TypeError(`${title}\n${body}\n${footer}`);
  }
}
