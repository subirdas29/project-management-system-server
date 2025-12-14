import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SprintRoutes } from '../modules/sprint/sprint.route';
import { ProjectRoutes } from '../modules/project/project.route';
import { TaskRoutes } from '../modules/task/task.route';
import { TeamRoutes } from '../modules/team/team.route';
import { ReportRoutes } from '../modules/report/report.route';
import { UserRoutes } from '../modules/user/user.route';
import { TaskCommentRoutes } from '../modules/taskComment/taskComment.route';




const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
   {
    path: '/comments',
    route: TaskCommentRoutes,
  },
 {
    path:'/sprint',
    route:SprintRoutes
  },

   {
    path:'/team',
    route:TeamRoutes
  },

   {
    path:'/reports',
    route:ReportRoutes
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
