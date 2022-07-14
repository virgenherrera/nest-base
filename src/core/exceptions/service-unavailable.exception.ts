import { ServiceUnavailableException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceUnavailable extends ServiceUnavailableException {
  @ApiProperty() readonly code: string;
  @ApiProperty() readonly message: string;
  @ApiProperty() readonly details: string[];

  constructor(...details: string[]) {
    super({
      code: 'unavailable-service-error',
      message: 'Unavailable service',
      details: [...details],
    });
  }
}
