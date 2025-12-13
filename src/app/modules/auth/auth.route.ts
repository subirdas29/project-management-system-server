import express from 'express';
import validationRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh-token',
  validationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/change-password',
  auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member),
  validationRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
