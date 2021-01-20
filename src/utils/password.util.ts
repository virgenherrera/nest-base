import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export function hashPassword(rawPass: string, rounds = 10) {
  const salt = genSaltSync(rounds);

  return hashSync(rawPass, salt);
}

export function validatePassword(rawPass: string, hashPass: string) {
  return compareSync(rawPass, hashPass);
}
