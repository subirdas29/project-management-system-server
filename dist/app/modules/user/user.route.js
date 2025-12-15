"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.userValidation.registerValidationSchema), user_controller_1.UserController.registerUser);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), user_controller_1.UserController.getAllUsers);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), user_controller_1.UserController.getMe);
router.patch('/me', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), (0, validateRequest_1.default)(user_validation_1.userValidation.updateProfileSchema), user_controller_1.UserController.updateProfile);
router.get('/:userId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), user_controller_1.UserController.getSingleUser);
exports.UserRoutes = router;
