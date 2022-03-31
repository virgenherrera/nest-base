import { compareRawAndHash, hashString } from './string.util';

const enum should {
  hashDefault = 'Should hash string using default salt value.',
  hashString = 'Should hash string using specific rounds.',
  compareStrings = 'Should compare raw and hashed strings.',
}

jest.mock('bcryptjs');

describe(`UT:hashString`, () => {
  it(should.hashDefault, () => {
    const inputString = 'test-string';

    expect(() => hashString(inputString)).not.toThrow();
  });

  it(should.hashString, () => {
    const inputString = 'test-string';

    expect(() => hashString(inputString, 3)).not.toThrow();
  });
});

describe('UT:compareRawAndHash', () => {
  it(should.hashString, () => {
    expect(() =>
      compareRawAndHash('string-1', 'mock-hashed-string'),
    ).not.toThrow();
  });
});
