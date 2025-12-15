import express from 'express';
import auth from '../../middlewares/auth';
import validationRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constant';
import { TaskCommentController } from './taskComment.controller';
import { taskCommentValidation } from './taskComment.validation';

const router = express.Router();


router.post(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  validationRequest(taskCommentValidation.createCommentSchema),
  TaskCommentController.addComment,
);


router.get(
  '/task/:taskId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  TaskCommentController.getTaskComments,
);

router.patch('/:commentId',   
auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
 TaskCommentController.updateComment);


router.delete(
  '/:commentId',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  TaskCommentController.deleteComment,
);

export const TaskCommentRoutes = router;
