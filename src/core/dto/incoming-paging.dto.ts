import { IsInt, Min } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  page = 1;

  @IsInt()
  @Min(1)
  per_page = 1;
}
