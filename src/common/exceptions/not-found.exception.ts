import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFound extends NotFoundException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'not-found-error',
      message: 'Not Found',
      details: [...details],
    });
  }
}
