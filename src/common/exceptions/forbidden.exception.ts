import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class Forbidden extends ForbiddenException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'forbidden-error',
      message: 'Forbidden',
      details: [...details],
    });
  }
}
