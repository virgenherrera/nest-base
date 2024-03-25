import { UnauthorizedException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class Unauthorized extends UnauthorizedException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'unauthorized-error',
      message: 'Unauthorized',
      details: [...details],
    });
  }
}
