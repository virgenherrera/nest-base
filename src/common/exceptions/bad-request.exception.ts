import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequest extends BadRequestException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: [...details],
    });
  }
}
