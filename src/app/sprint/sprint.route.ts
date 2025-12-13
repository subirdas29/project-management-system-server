import express from 'express';

import { SprintController } from './sprint.controller';
import { sprintValidation } from './sprint.validation';
import auth from '../middlewares/auth';
import { USER_ROLES } from '../modules/user/user.constant';
import validationRequest from '../middlewares/validateRequest';

const router = express.Router();

// ✅ Create sprint (Admin/Manager)
router.post(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.createSprintValidationSchema),
  SprintController.createSprint,
);

// ✅ List sprints by project (Member/Manager/Admin can view)
router.get(
  '/project/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  SprintController.getProjectSprints,
);

// ✅ Single sprint
router.get(
  '/:sprintId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  SprintController.getSingleSprint,
);

// ✅ Update sprint (Admin/Manager)
router.patch(
  '/:sprintId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.updateSprintValidationSchema),
  SprintController.updateSprint,
);

// ✅ Delete sprint (Admin/Manager) — soft delete
router.delete(
  '/:sprintId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  SprintController.deleteSprint,
);

// ✅ Order management: reorder (Admin/Manager)
router.patch(
  '/reorder',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(sprintValidation.reorderSprintValidationSchema),
  SprintController.reorderSprints,
);

export const SprintRoutes = router;
