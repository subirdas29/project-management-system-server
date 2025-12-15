"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const report_controller_1 = require("./report.controller");
const router = express_1.default.Router();
router.get('/project/:projectId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), report_controller_1.ReportController.getProjectReport);
router.get('/user/:userId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), report_controller_1.ReportController.getUserReport);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), report_controller_1.ReportController.getMyReport);
exports.ReportRoutes = router;
