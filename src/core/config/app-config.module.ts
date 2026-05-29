import { DynamicModule, Logger, Type } from '@nestjs/common';
import { ConfigModule, getConfigToken, registerAs } from '@nestjs/config';
import { type ZodDto } from 'nestjs-zod';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, env } from 'node:process';
import { z, ZodError } from 'zod';

const PackageIdentitySchema = z.object({
  npm_package_name: z.string().min(1),
  npm_package_version: z.string().min(1),
});

const PackageJsonFallbackSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
  })
  .transform((pkg) => ({
    npm_package_name: pkg.name,
    npm_package_version: pkg.version,
  }));

type EnvProvider = () => NodeJS.ProcessEnv | Promise<NodeJS.ProcessEnv>;
type ConfigClass = ZodDto;
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
  envProvider: () => Promise<NodeJS.ProcessEnv>;
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

    const baseProvider = options.envProvider ?? (() => env);
    let cachedEnvSource: Promise<NodeJS.ProcessEnv> | null = null;

    return {
      cache: options.cache ?? false,
      expandVariables: options.expandVariables ?? true,
      isGlobal: options.isGlobal ?? true,
      configClasses: options.configClasses,
      envProvider: async () => {
        if (!cachedEnvSource) {
          cachedEnvSource = Promise.resolve(baseProvider()).then((baseEnv) => ({
            ...this.resolvePackageIdentity(baseEnv),
            ...baseEnv,
          }));
        }

        return cachedEnvSource;
      },
    };
  }

  private static registerConfigFactories(
    configClasses: ConfigClass[],
    options: ResolvedAppConfigOptions,
  ) {
    return configClasses.map((configClass) =>
      this.createConfigFactory(configClass, options),
    );
  }

  private static createConfigFactory<T extends ConfigClass>(
    classConstructor: T,
    options: ResolvedAppConfigOptions,
  ) {
    const configFactory = registerAs(classConstructor.name, async () => {
      const resolvedEnvironment = await options.envProvider();
      if (!('isZodDto' in classConstructor) || !classConstructor.isZodDto) {
        throw new TypeError(
          `Configuration class "${classConstructor.name}" must be a nestjs-zod DTO.`,
        );
      }

      const schema = classConstructor.schema as z.ZodTypeAny;

      if (typeof schema.safeParse !== 'function') {
        throw new TypeError(
          `Configuration class "${classConstructor.name}" must use a zod schema that supports safeParse.`,
        );
      }

      const result = schema.safeParse(resolvedEnvironment);

      if (!result.success) {
        this.buildValidationError(classConstructor, result.error);
      }

      const instance = result.data;

      Object.seal(instance);
      Object.freeze(instance);

      return instance;
    });

    return configFactory;
  }

  private static resolvePackageIdentity(
    baseEnv: NodeJS.ProcessEnv,
  ): z.infer<typeof PackageIdentitySchema> {
    const fromEnv = PackageIdentitySchema.strip().safeParse(baseEnv);

    if (fromEnv.success) return fromEnv.data;

    const pkg = JSON.parse(readFileSync(join(cwd(), 'package.json'), 'utf-8'));

    return PackageJsonFallbackSchema.parse(pkg);
  }

  private static buildValidationError(
    classConstructor: ConfigClass,
    error: ZodError,
  ): never {
    const title = `Configuration validation error(s) in class "${classConstructor.name}"`;
    const body = z.prettifyError(error);
    const footer =
      'Verify the values provided via environment variables or your .env file.';

    throw new TypeError(`${title}\n${body}\n${footer}`);
  }
}
