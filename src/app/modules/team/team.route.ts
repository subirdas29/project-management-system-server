import express from 'express';
import { TeamController } from './team.controller';
import validationRequest from '../../middlewares/validateRequest';
import { teamValidation } from './team.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(teamValidation.addTeamMemberSchema),
  TeamController.addTeamMember,
);

router.get(
  '/project/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  TeamController.getProjectTeam,
);

router.patch(
  '/:teamId',
  auth(USER_ROLES.admin),
  TeamController.updateTeamMember,
);

router.delete(
  '/:teamId',
  auth(USER_ROLES.admin),
  TeamController.removeTeamMember,
);


export const TeamRoutes = router;
