import { registerAs } from '@nestjs/config';
import { ClassConstructor as Class, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { exit } from 'node:process';

export class ValidConfig<T> {
  static registerAs<T>(cls: Class<T>): ReturnType<typeof registerAs> {
    return registerAs(cls.name, async (): Promise<T> => {
      const validConfig = new ValidConfig(cls);

      return await validConfig.getValidInstance();
    });
  }

  private clsInstance: T;
  private errors: ValidationError[];

  private constructor(private readonly cls: Class<T>) {
    this.clsInstance = plainToInstance(this.cls, new this.cls(), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  private async getValidInstance() {
    this.errors = await this.validateInstance();

    if (this.errors.length) this.handleError();

    Object.seal(this.clsInstance);
    Object.freeze(this.clsInstance);

    return this.clsInstance;
  }

  private async validateInstance(): ReturnType<typeof validate> {
    return validate(this.clsInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    });
  }

  private handleError() {
    const msgTitle = `Configuration validation error in:`;

    const errStr = this.getErrorExplanation();

    console.warn(msgTitle + '\n' + '='.repeat(msgTitle.length));
    console.log(errStr + '\n');
    exit(1);
  }

  private getErrorExplanation(): string {
    return this.errors.reduce((acc, curr) => {
      const regExp = new RegExp(`(.+${curr.property}\\s?=.+\n)`, 'gm');

      acc = acc.replace(regExp, this.getReplacerFn(curr));

      return acc;
    }, this.cls.toString());
  }

  private getReplacerFn(
    error: ValidationError,
  ): Parameters<typeof String.prototype.replace>[1] {
    return match => {
      const spaces = match.indexOf(error.property);
      const prefix = ' '.repeat(spaces);
      const arrowLine = `${prefix}${' '.repeat(error.property.length)}\x1b[31m↖ \x1b[33m value: \x1b[4m${error.value}\x1b[0m\n`;
      const constraintsStr = Object.values(error.constraints)
        .map(constraint => `${prefix}* ${constraint}`)
        .join('\n');

      return `${match}${arrowLine}${constraintsStr}\n\n`;
    };
  }
}
