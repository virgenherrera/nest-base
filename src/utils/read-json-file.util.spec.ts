import { cwd } from 'node:process';
import { readJsonFile } from './read-json-file';

describe(`UT:${readJsonFile.name}`, () => {
  it('Should not Throw', () => {
    expect(() => readJsonFile(cwd(), 'package.json')).not.toThrow();
  });
});
