import { readJsonFile } from './read-json-file';

export function getPackageMetadata() {
  const packageJson = readJsonFile(process.cwd(), './package.json');
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
