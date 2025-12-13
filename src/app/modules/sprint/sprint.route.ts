import express from 'express';

import { SprintController } from './sprint.controller';
import { sprintValidation } from './sprint.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validationRequest from '../../middlewares/validateRequest';

const router = express.Router();


router.patch(
  '/reorder',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.reorderSprintValidationSchema),
  SprintController.reorderSprints,
);

router.post(
  '/',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.createSprintValidationSchema),
  SprintController.createSprint,
);


router.get(
  '/project/:projectId',
//   auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  SprintController.getProjectSprints,
);


router.get(
  '/:sprintId',
//   auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  SprintController.getSingleSprint,
);


router.patch(
  '/:sprintId',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.updateSprintValidationSchema),
  SprintController.updateSprint,
);


router.delete(
  '/:sprintId',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  SprintController.deleteSprint,
);



export const SprintRoutes = router;
