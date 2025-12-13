import express from 'express';
import { ProjectController } from './project.controller';
// import auth from '../middlewares/auth';
import validationRequest from '../../middlewares/validateRequest';
import { projectValidation } from './project.validation';
// import { USER_ROLES } from '../modules/user/user.constant';

const router = express.Router();

router.post(
  '/',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.createProjectValidationSchema),
  ProjectController.createProject,
);

router.get('/', 
    // auth(), 
ProjectController.getAllProjects);

router.get('/:projectId',
    //  auth(),
      ProjectController.getSingleProject);

router.patch(
  '/:projectId',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.updateProjectValidationSchema),
  ProjectController.updateProject,
);

router.delete(
  '/:projectId',
//   auth(USER_ROLES.admin),
  ProjectController.deleteProject,
);

export const ProjectRoutes = router;
