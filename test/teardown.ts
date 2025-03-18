import { TestContext } from './utils';

export default async function Teardown() {
  const isWatchMode = process.argv.some((arg) => arg.includes('--watch'));

  if (isWatchMode) return;

  await TestContext.destruct();
}
