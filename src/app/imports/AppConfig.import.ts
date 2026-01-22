import { DynamicModule, Logger, Type } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { env } from 'node:process';

type EnvProvider = () => NodeJS.ProcessEnv | Promise<NodeJS.ProcessEnv>;
type ConfigClass = ClassConstructor<unknown>;

export type AppConfigModuleOptions = {
  cache?: boolean;
  expandVariables?: boolean;
  isGlobal?: boolean;
  configClasses: [ConfigClass, ...ConfigClass[]];
  envProvider?: EnvProvider;
};

type ResolvedAppConfigOptions = {
  cache: boolean;
  expandVariables: boolean;
  isGlobal: boolean;
  configClasses: [ConfigClass, ...ConfigClass[]];
  envProvider: EnvProvider;
};

export class AppConfigModule {
  private static readonly logger = new Logger(AppConfigModule.name);
  private static readonly classNameTokenMap = new Map<
    string,
    string | symbol
  >();

  static forRoot(options: AppConfigModuleOptions): DynamicModule {
    const resolved = this.resolveOptions(options);
    const configFactories = this.registerConfigFactories(
      resolved.configClasses,
      resolved.envProvider,
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

  static getToken(cls: Type): string | symbol | undefined {
    return this.classNameTokenMap.get(cls.name) ?? `CONFIGURATION(${cls.name})`;
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
    };
  }

  private static registerConfigFactories(
    configClasses: ConfigClass[],
    envProvider: EnvProvider,
  ): ReturnType<typeof registerAs>[] {
    return configClasses.map((configClass) =>
      this.createConfigFactory(configClass, envProvider),
    );
  }

  private static createConfigFactory<T>(
    classConstructor: ClassConstructor<T>,
    envProvider: EnvProvider,
  ) {
    const configFactory = registerAs(classConstructor.name, async () => {
      const envSource = await envProvider();
      const instance = plainToInstance(classConstructor, envSource, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      });
      const errors = await validate(instance as object, {
        forbidNonWhitelisted: true,
        stopAtFirstError: false,
        whitelist: true,
      });

      if (errors.length) {
        throw this.buildValidationError(classConstructor, errors);
      }

      Object.seal(instance);
      Object.freeze(instance);

      return instance;
    });

    this.classNameTokenMap.set(classConstructor.name, configFactory.KEY);

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
