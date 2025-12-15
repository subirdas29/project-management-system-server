"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const taskComment_controller_1 = require("./taskComment.controller");
const taskComment_validation_1 = require("./taskComment.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), (0, validateRequest_1.default)(taskComment_validation_1.taskCommentValidation.createCommentSchema), taskComment_controller_1.TaskCommentController.addComment);
router.get('/task/:taskId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), taskComment_controller_1.TaskCommentController.getTaskComments);
router.patch('/:commentId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), taskComment_controller_1.TaskCommentController.updateComment);
router.delete('/:commentId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), taskComment_controller_1.TaskCommentController.deleteComment);
exports.TaskCommentRoutes = router;
