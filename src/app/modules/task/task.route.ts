import express from 'express';
import validationRequest from '../../middlewares/validateRequest';
import { TaskController } from './task.controller';
import { taskValidation } from './task.validation';

const router = express.Router();


router.get('/', TaskController.getAllTasks);

router.post(
  '/',
  validationRequest(taskValidation.createTaskValidationSchema),
  TaskController.createTask,
);


router.patch(
  '/:taskId/status',
  validationRequest(taskValidation.updateTaskStatusValidationSchema),
  TaskController.updateTaskStatus,
);

router.get('/:taskId', TaskController.getSingleTask);


router.patch(
  '/:taskId',
  validationRequest(taskValidation.updateTaskValidationSchema),
  TaskController.updateTask,
);


router.delete('/:taskId', TaskController.deleteTask);

export const TaskRoutes = router;
