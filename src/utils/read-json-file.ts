import { readFileSync } from 'fs';
import { join, resolve } from 'path';

export function readJsonFile<T = any>(...paths: string[]): T {
  const path = resolve(join(...paths));
  const stringFileContent = readFileSync(path, {
    encoding: 'utf8',
    flag: 'r',
  });
  const jsonFile = JSON.parse(stringFileContent);

  return jsonFile as T;
}
