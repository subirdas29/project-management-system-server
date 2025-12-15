"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("./team.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const team_validation_1 = require("./team.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), (0, validateRequest_1.default)(team_validation_1.teamValidation.addTeamMemberSchema), team_controller_1.TeamController.addTeamMember);
router.get('/project/:projectId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager, user_constant_1.USER_ROLES.member), team_controller_1.TeamController.getProjectTeam);
router.patch('/:teamId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), team_controller_1.TeamController.updateTeamMember);
router.delete('/:teamId', (0, auth_1.default)(user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.manager), team_controller_1.TeamController.removeTeamMember);
exports.TeamRoutes = router;
