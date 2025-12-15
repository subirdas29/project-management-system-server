"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const task_controller_1 = require("./task.controller");
const task_validation_1 = require("./task.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), task_controller_1.TaskController.getAllTasks);
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), (0, validateRequest_1.default)(task_validation_1.taskValidation.createTaskValidationSchema), task_controller_1.TaskController.createTask);
router.patch('/:taskId/status', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), 
// validationRequest(taskValidation.updateTaskStatusValidationSchema),
task_controller_1.TaskController.updateTaskStatus);
router.get('/:taskId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), task_controller_1.TaskController.getSingleTask);
router.patch('/:taskId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), (0, validateRequest_1.default)(task_validation_1.taskValidation.updateTaskValidationSchema), task_controller_1.TaskController.updateTask);
router.patch('/:taskId/log-time', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), (0, validateRequest_1.default)(task_validation_1.taskValidation.logTaskTimeValidationSchema), task_controller_1.TaskController.logTaskTime);
router.delete('/:taskId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), task_controller_1.TaskController.deleteTask);
exports.TaskRoutes = router;
