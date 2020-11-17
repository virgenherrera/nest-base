import { appRoutes } from 'src/app.routes';

export const userRoutes = {
  users: `${appRoutes.api}/users`,
  user: `${appRoutes.api}/users/:id`,
};
