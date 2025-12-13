import express from 'express';
import { ProjectController } from './project.controller';
// import auth from '../middlewares/auth';
import validationRequest from '../middlewares/validateRequest';
import { projectValidation } from './project.validation';
// import { USER_ROLES } from '../modules/user/user.constant';

const router = express.Router();

router.post(
  '/create',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.createProjectValidationSchema),
  ProjectController.createProject,
);

router.get('/all', 
    // auth(), 
ProjectController.getAllProjects);

router.get('/single/:projectId',
    //  auth(),
      ProjectController.getSingleProject);

router.patch(
  '/update/:projectId',
//   auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(projectValidation.updateProjectValidationSchema),
  ProjectController.updateProject,
);

router.delete(
  '/delete/:projectId',
//   auth(USER_ROLES.admin),
  ProjectController.deleteProject,
);

export const ProjectRoutes = router;
