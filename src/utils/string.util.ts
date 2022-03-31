import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export function hashString(str: string, saltRounds = 10): string {
  const salt = genSaltSync(saltRounds);

  return hashSync(str, salt);
}

export function compareRawAndHash(rawStr: string, hashStr: string): boolean {
  return compareSync(rawStr, hashStr);
}
