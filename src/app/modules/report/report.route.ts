import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/projects/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  ReportController.getProjectReport,
);

router.get(
  '/me',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  ReportController.getMyReport,
);



export const ReportRoutes = router;
