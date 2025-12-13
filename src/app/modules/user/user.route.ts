import express from 'express';
import validationRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { UserController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validationRequest(userValidation.registerValidationSchema),
  UserController.registerUser,
);

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  UserController.getAllUsers,
);

router.get(
  '/me',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  UserController.getMe,
);

router.patch(
  '/me',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  validationRequest(userValidation.updateProfileSchema),
  UserController.updateProfile,
);

router.get(
  '/:userId',
  auth(USER_ROLES.admin, USER_ROLES.manager),
  UserController.getSingleUser,
);

export const UserRoutes = router;
