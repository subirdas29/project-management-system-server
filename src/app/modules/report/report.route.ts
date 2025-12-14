import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { ReportController } from './report.controller';

const router = express.Router();


router.get(
  '/project/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  ReportController.getProjectReport,
);


router.get(
  '/user/:userId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  ReportController.getUserReport,
);


router.get(
  '/me',
  auth(
    USER_ROLES.admin,
    USER_ROLES.manager,
    USER_ROLES.member,
  ),
  ReportController.getMyReport,
);

export const ReportRoutes = router;
