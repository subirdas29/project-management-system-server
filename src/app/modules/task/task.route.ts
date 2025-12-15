import express from 'express';
import validationRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { taskValidation } from './task.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  TaskController.getAllTasks,
);

router.post(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  validationRequest(taskValidation.createTaskValidationSchema),
  TaskController.createTask,
);

router.patch(
  '/:taskId/status',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  // validationRequest(taskValidation.updateTaskStatusValidationSchema),
  TaskController.updateTaskStatus,
);

router.get(
  '/:taskId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  TaskController.getSingleTask,
);

router.patch(
  '/:taskId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  validationRequest(taskValidation.updateTaskValidationSchema),
  TaskController.updateTask,
);
router.patch(
  '/:taskId/log-time',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  validationRequest(taskValidation.logTaskTimeValidationSchema),
  TaskController.logTaskTime,
);


router.delete(
  '/:taskId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  TaskController.deleteTask,
);


export const TaskRoutes = router;
