import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/project/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  ReportController.getProjectReport,
);

router.get(
  '/user/:userId',
  auth(USER_ROLES.admin),
  ReportController.getUserReport,
);


export const ReportRoutes = router;
