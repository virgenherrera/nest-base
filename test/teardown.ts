import { TestContext } from './utils';

export default async function Teardown() {
  // destroy test CTX
  await TestContext.destruct();
}
