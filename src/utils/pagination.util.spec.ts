import { plainToInstance } from 'class-transformer';

import {
  BasePagedParamsDto,
  PagedResults,
  Pagination,
} from '../application/dto';
import { PaginationUtil } from './pagination.util';

describe(`UT:${PaginationUtil.name}`, () => {
  const enum should {
    beDeclared = 'Should be declared properly.',
    Paginate = 'Should paginate results properly.',
    HandleEmptyResults = 'Should handle empty results properly.',
    HandlePrevUrl = 'Should generate a valid "prev" URL when there is a previous page.',
  }

  class TestPagedParamsDto extends BasePagedParamsDto {
    filter: string;
  }

  class TestEntity {
    id: number;
    name: string;
  }

  it(should.beDeclared, () => {
    // Assert
    expect(PaginationUtil).toBeDefined();
    expect(PaginationUtil).toHaveProperty('getResults', expect.any(Function));
  });

  it(should.Paginate, () => {
    // Arrange
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

    // Act
    const result = PaginationUtil.getResults(query, rows, totalRecords);

    // Assert
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

  it(should.HandleEmptyResults, () => {
    // Arrange
    const query = plainToInstance(TestPagedParamsDto, {
      page: 1,
      perPage: 2,
      filter: 'test',
    });
    const rows: TestEntity[] = [];
    const totalRecords = 0;

    // Act
    const result = PaginationUtil.getResults(query, rows, totalRecords);

    // Assert
    expect(result).toBeInstanceOf(PagedResults);
    expect(result.rows).toHaveLength(0);
    expect(result.pagination).toBeInstanceOf(Pagination);
    expect(result.pagination.page).toBe(query.page);
    expect(result.pagination.perPage).toBe(query.perPage);
    expect(result.pagination.totalRecords).toBe(totalRecords);
    expect(result.pagination.prev).toBeNull();
    expect(result.pagination.next).toBeNull();
  });

  it(should.HandlePrevUrl, () => {
    // Arrange
    const testParams = {
      page: 2,
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

    // Act
    const result = PaginationUtil.getResults(query, rows, totalRecords);

    // Assert
    expect(result).toBeInstanceOf(PagedResults);
    expect(result.rows).toHaveLength(rows.length);
    expect(result.pagination).toBeInstanceOf(Pagination);
    expect(result.pagination.page).toBe(query.page);
    expect(result.pagination.perPage).toBe(query.perPage);
    expect(result.pagination.totalRecords).toBe(totalRecords);
    expect(result.pagination.prev).toBe(
      `?filter=test&page=1&perPage=${query.perPage}`,
    );
    expect(result.pagination.next).toBeNull();
  });
});
