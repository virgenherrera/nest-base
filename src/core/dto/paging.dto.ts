import { BadRequestException } from '@nestjs/common';
import { IsInt, Min, validateSync } from 'class-validator';

export class Paging {
  @IsInt()
  @Min(1)
  page = 1;

  @IsInt()
  @Min(1)
  per_page = 1;

  count = 0;
  prev = '';
  next = '';

  constructor(query: any) {
    this.page = query.page;
    this.per_page = query.page;

    try {
      validateSync(this);
    } catch (exception) {
      throw new BadRequestException(exception);
    }
  }
}
