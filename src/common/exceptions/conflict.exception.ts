import { ConflictException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class Conflict extends ConflictException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'conflict-error',
      message: 'Conflict',
      details: [...details],
    });
  }
}
