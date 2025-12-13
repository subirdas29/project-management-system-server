import express from 'express';
import { ProjectController } from './project.controller';

import validationRequest from '../../middlewares/validateRequest';
import { projectValidation } from './project.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';


const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.createProjectValidationSchema),
  ProjectController.createProject,
);

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  ProjectController.getAllProjects,
);

router.get(
  '/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  ProjectController.getSingleProject,
);

router.patch(
  '/:projectId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.updateProjectValidationSchema),
  ProjectController.updateProject,
);

router.delete(
  '/:projectId',
  auth(USER_ROLES.admin),
  ProjectController.deleteProject,
);
router.get(
  '/:projectId/overview',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  ProjectController.getProjectOverview,
);



export const ProjectRoutes = router;
