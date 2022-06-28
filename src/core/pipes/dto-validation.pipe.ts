import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { BadRequest } from '../exceptions';

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
    return this.isPrimitiveType(metatype)
      ? value
      : this.validate(value, metatype);
  }

  private isPrimitiveType(metatype: ArgumentMetadata['metatype']) {
    return !metatype || this.skipTypes.includes(metatype);
  }

  private async validate(value: any, metatype: ArgumentMetadata['metatype']) {
    const instance = plainToClass(metatype, value, this.classTransformOptions);
    const validationErrors = await validate(instance, this.validatorOptions);

    if (!validationErrors.length) return instance;

    throw new BadRequest(this.parseErrors(validationErrors));
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
