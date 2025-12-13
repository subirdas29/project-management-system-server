import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SprintRoutes } from '../modules/sprint/sprint.route';
import { ProjectRoutes } from '../modules/project/project.route';
import { TaskRoutes } from '../modules/task/task.route';
// import { UserRoutes } from '../modules/user/user.route';




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
    path:'/sprint',
    route:SprintRoutes
  },

   {
    path:'/tasks',
    route:TaskRoutes
  },
 
  {
    path:'/projects',
    route:ProjectRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
