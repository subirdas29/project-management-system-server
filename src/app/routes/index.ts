import { Router } from 'express';
// import { UserRoutes } from '../modules/user/user.route';

import { AuthRoutes } from '../modules/auth/auth.route';

import { ProjectRoutes } from '../project/project.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  // {
  //   path: '/user',
  //   route: UserRoutes,
  // },

 
  {
    path:'/projects',
    route:ProjectRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
