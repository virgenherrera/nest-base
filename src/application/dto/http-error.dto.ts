import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({ example: 400 })
  statusCode = 400;

  @ApiProperty({ example: 'bad-request-error' })
  readonly code = 'bad-request-error';

  @ApiProperty({ example: 'Bad Request' })
  readonly message = 'Bad Request';

  @ApiProperty({
    isArray: true,
    example: ['error-1', 'error-2'],
  })
  readonly details: string[];
}

export class NotFoundDto {
  @ApiProperty({ example: 404 })
  statusCode = 404;

  @ApiProperty({ example: 'not-found-error' })
  readonly code = 'not-found-error';

  @ApiProperty({ example: 'Not Found' })
  readonly message = 'Not Found';

  @ApiProperty({
    isArray: true,
    example: ['error-1', 'error-2'],
  })
  readonly details: string[];
}

export class InternalServerErrorDto {
  @ApiProperty({ example: 500 })
  statusCode = 500;

  @ApiProperty({ example: 'internal-server-error' })
  readonly code = 'internal-server-error';

  @ApiProperty({ example: 'Server Error' })
  readonly message = 'Server Error';

  @ApiProperty({
    isArray: true,
    example: ['error-1', 'error-2'],
  })
  readonly details: string[];
}
