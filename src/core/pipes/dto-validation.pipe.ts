import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';

@Injectable()
export class DtoValidation implements PipeTransform {
  static defaultValidatorOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true,
  };

  static defaultClassTransformOptions: ClassTransformOptions = {
    excludeExtraneousValues: false,
  };

  static get pipe() {
    return new DtoValidation();
  }

  private skipTypes: Type[] = [Array, Boolean, Number, Object, String];

  constructor(
    private validatorOptions = DtoValidation.defaultValidatorOptions,
    private classTransformOptions = DtoValidation.defaultClassTransformOptions,
  ) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.skipTypes.includes(metatype)) return value;

    const instance = plainToClass(metatype, value, this.classTransformOptions);
    const validationErrors = await validate(instance, this.validatorOptions);

    if (!validationErrors.length) return instance;

    const details = this.parseErrors(validationErrors);
    const errorResponse = {
      code: 'bad-request-error',
      message: 'Bad Request',
      details,
    };

    throw new BadRequestException(errorResponse);
  }

  private parseErrors(validationErrors: ValidationError[], parent?: string) {
    const initialValue: string[] = [];

    return validationErrors.reduce((accConstraints, validationError) => {
      const propConnector = parent ? `${parent}.` : '';
      const propertyName = `${propConnector}${validationError.property}`;
      const constraints = validationError.children?.length
        ? this.parseErrors(validationError.children, propertyName)
        : Object.values(validationError.constraints).map(constraint =>
            constraint.replace(validationError.property, propertyName),
          );

      return [...accConstraints, ...constraints];
    }, initialValue);
  }
}
