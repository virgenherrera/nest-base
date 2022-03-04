import { ArgumentMetadata } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { BadRequest } from '../exceptions';
import { DtoValidation } from './dto-validation.pipe';

describe('UT:DtoValidationPipe', () => {
  const enum should {
    createInstance = 'Should create instance Properly.',
    staticGetter = 'Should get default instance by using static getter.',
    primitiveMetatype = 'Should return raw value when metatype is a primitive type.',
    transformAndValidate = `Should transform and validate plain object and create instance of given DTO.`,
    throwBadRequest = `Should BadRequestException containing a list of validation errors.`,
    throwNestedBadRequest = `Should BadRequestException containing a list of validation errors when validating nested Objects.`,
  }

  class ParentDto {
    @ValidateNested({ each: true })
    @Type(() => MockDto)
    mockDtos: MockDto[];
  }
  class MockDto {
    @IsDefined()
    @IsString()
    username: string;

    @IsDefined()
    @IsString()
    password: string;
  }
  let pipe: DtoValidation = null;

  beforeAll(() => {
    pipe = new DtoValidation();
  });

  it(should.createInstance, () => {
    expect(pipe).not.toBeNull();
    expect(pipe).toBeInstanceOf(DtoValidation);
  });

  it(should.staticGetter, async () => {
    let dtoValidation: DtoValidation = null;

    expect(() => (dtoValidation = DtoValidation.pipe)).not.toThrow();
    expect(dtoValidation).toBeInstanceOf(DtoValidation);
  });

  it(should.primitiveMetatype, async () => {
    const value = {
      username: 'fake-username',
      password: 'fake-password',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: Boolean,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).resolves.toBe(value);
  });

  it(should.transformAndValidate, async () => {
    const value = {
      username: 'fake-username',
      password: 'fake-password',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: MockDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).resolves.toBeInstanceOf(
      MockDto,
    );
  });

  it(should.throwBadRequest, async () => {
    const value = {
      arr: [{ k1: 'v1', k2: 'v2' }],
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: MockDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).rejects.toBeInstanceOf(
      BadRequest,
    );
  });

  it(should.throwNestedBadRequest, async () => {
    const value = {
      mockDtos: [{ k1: 'v1', k2: 'v2' }],
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: ParentDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).rejects.toBeInstanceOf(
      BadRequest,
    );
  });
});
