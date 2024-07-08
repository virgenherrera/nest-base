import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of results per page',
    example: 50,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total number of records',
    example: 200,
  })
  totalRecords: number;

  @ApiProperty({
    description:
      'URL of the previous page or null if there is no previous page',
    example: '/{urlPath}?page=1&perPage=50',
    nullable: true,
  })
  prev: string | null;

  @ApiProperty({
    description: 'URL of the next page or null if there is no next page',
    example: '/{urlPath}?page=3&perPage=50',
    nullable: true,
  })
  next: string | null;
}
