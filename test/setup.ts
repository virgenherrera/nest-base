export default async function Setup() {
  // set E2E TEST ENV Variables
  process.env.NODE_ENV = 'TEST';
  process.env.APP_PORT = '0';
}
