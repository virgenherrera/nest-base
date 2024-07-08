import { plainToInstance } from 'class-transformer';

import { BasePagedParamsDto, PagedResults, Pagination } from '../common/dto';
import { PaginationUtil } from './pagination.util';

describe(`UT:${PaginationUtil.name}`, () => {
  const enum should {
    declared = 'Should be Declared properly.',
    paginate = 'Should paginate results properly.',
    handleEmptyResults = 'Should handle empty results properly.',
  }

  class TestPagedParamsDto extends BasePagedParamsDto {
    filter: string;
  }

  class TestEntity {
    id: number;
    name: string;
  }

  it(should.declared, () => {
    expect(PaginationUtil).toBeDefined();
    expect(PaginationUtil).toHaveProperty('getResults', expect.any(Function));
  });

  it(should.paginate, () => {
    const testParams = {
      page: 1,
      perPage: 2,
      filter: 'test',
    };
    const query = plainToInstance(TestPagedParamsDto, testParams);
    const rows = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
      { id: 3, name: 'Test 3' },
    ];
    const totalRecords = 3;
    const result = PaginationUtil.getResults(
      testParams as any,
      rows,
      totalRecords,
    );

    expect(result).toBeInstanceOf(PagedResults);
    expect(result.rows).toHaveLength(rows.length);
    expect(result.pagination).toBeInstanceOf(Pagination);
    expect(result.pagination.page).toBe(query.page);
    expect(result.pagination.perPage).toBe(query.perPage);
    expect(result.pagination.totalRecords).toBe(totalRecords);
    expect(result.pagination.prev).toBeNull();
    expect(result.pagination.next).toBe(
      `?filter=test&page=2&perPage=${query.perPage}`,
    );
  });

  it(should.handleEmptyResults, () => {
    const query = plainToInstance(TestPagedParamsDto, {
      page: 1,
      perPage: 2,
      filter: 'test',
    });

    const rows: TestEntity[] = [];
    const totalRecords = 0;

    const result = PaginationUtil.getResults(query, rows, totalRecords);

    expect(result).toBeInstanceOf(PagedResults);
    expect(result.rows).toHaveLength(0);
    expect(result.pagination).toBeInstanceOf(Pagination);
    expect(result.pagination.page).toBe(query.page);
    expect(result.pagination.perPage).toBe(query.perPage);
    expect(result.pagination.totalRecords).toBe(totalRecords);
    expect(result.pagination.prev).toBeNull();
    expect(result.pagination.next).toBeNull();
  });
});
