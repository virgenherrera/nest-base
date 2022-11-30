import { readJsonFile } from './read-json-file';

describe(`UT:${readJsonFile.name}`, () => {
  it('Should not Throw', () => {
    expect(() => readJsonFile(process.cwd(), 'package.json')).not.toThrow();
  });
});
