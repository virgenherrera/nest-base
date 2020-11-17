import { APP_CONFIG } from '@core/tokens';
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs(APP_CONFIG, () => {
  const { APP_PORT, APP_USE_DOCS } = process.env;
  const config = {
    port: parseInt(APP_PORT, 10),
    useDocs: APP_USE_DOCS === 'true',
  };

  Object.seal(config);
  Object.freeze(config);

  return config;
});
