import { plainToInstance } from 'class-transformer';

import { BasePagedParamsDto, PagedResults, Pagination } from '../common/dto';

export class PaginationUtil<T extends BasePagedParamsDto, U extends any[]> {
  static getResults<T extends BasePagedParamsDto, U extends any[]>(
    query: T,
    rows: U,
    totalRecords: number,
  ): PagedResults<U> {
    const { pagedResults } = new PaginationUtil(query, rows, totalRecords);

    return pagedResults;
  }

  private constructor(
    private readonly query: T,
    private readonly rows: U,
    private readonly totalRecords: number,
  ) {}

  private get pagedResults(): PagedResults<U> {
    const { rows, pagination } = this;

    return plainToInstance(PagedResults<U>, { rows, pagination });
  }

  private get pagination(): Pagination {
    const { paginationUrls, query, totalRecords } = this;
    const { page, perPage } = query;
    const { prev, next } = paginationUrls;

    return plainToInstance(Pagination, {
      page,
      perPage,
      totalRecords,
      prev,
      next,
    });
  }

  private get paginationUrls(): Pick<Pagination, 'prev' | 'next'> {
    const { page, perPage, ...rest } = this.query;
    const prevPage = page - 1;
    const nextPage = page + 1;
    const hasPrevPage = prevPage >= 1;
    const hasNextPage = nextPage <= Math.ceil(this.totalRecords / perPage);
    const getUrl = (newPage: number) => {
      const params = new URLSearchParams({
        ...rest,
        page: newPage.toString(),
        perPage: perPage.toString(),
      });

      return `?${params.toString()}`;
    };

    return {
      prev: hasPrevPage ? getUrl(prevPage) : null,
      next: hasNextPage ? getUrl(nextPage) : null,
    };
  }
}
