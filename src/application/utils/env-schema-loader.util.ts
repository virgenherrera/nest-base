import { registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { env, exit } from 'node:process';

export class EnvSchemaLoader<T> {
  static validate<T>(cls: ClassConstructor<T>): ReturnType<typeof registerAs> {
    return registerAs(cls.name, async (): Promise<T> => {
      const instance = new EnvSchemaLoader(cls);

      return await instance.getValidConfig();
    });
  }

  private classInstance: T;
  private errors: ValidationError[];

  private constructor(cls: ClassConstructor<T>) {
    this.classInstance = plainToInstance(cls, env, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  private async getValidConfig(): Promise<T> {
    this.errors = await this.getConfigErrors();

    if (this.errors.length) this.handleError();

    Object.seal(this.classInstance);
    Object.freeze(this.classInstance);

    return this.classInstance;
  }

  private async getConfigErrors(): ReturnType<typeof validate> {
    return validate(this.classInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    });
  }

  private handleError(): never {
    const msgTitle = `Environment validation error found!`;

    console.warn(msgTitle + '\n' + '='.repeat(msgTitle.length));
    this.errors.forEach(({ target, constraints }) => {
      console.log('in:', target);
      console.log('errors:', constraints);
    });
    console.trace();
    exit(1);
  }
}
