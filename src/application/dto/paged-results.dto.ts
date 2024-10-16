import { ApiProperty } from '@nestjs/swagger';

import { Pagination } from './pagination.dto';

export class PagedResults<T extends any[]> {
  @ApiProperty({
    description: 'List of results for the current page',
    isArray: true,
  })
  rows: T[];

  @ApiProperty({
    description: 'Pagination details',
  })
  pagination: Pagination;
}
