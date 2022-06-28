import { readFileSync } from 'fs';
import { join, resolve } from 'path';

export function getPackageMetadata() {
  const path = resolve(join(process.cwd(), './package.json'));
  const stringFileContent = readFileSync(path, {
    encoding: 'utf8',
    flag: 'r',
  });
  const packageJson = JSON.parse(stringFileContent);
  const name: string = packageJson.name;
  const version: string = packageJson.version;
  const description: string = packageJson.description;
  const license: string = packageJson.license;
  const keywords: string[] = packageJson.keywords;

  return {
    name,
    version,
    description,
    license,
    keywords,
  };
}
