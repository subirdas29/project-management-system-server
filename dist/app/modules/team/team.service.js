"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const team_model_1 = require("./team.model");
const user_model_1 = require("../user/user.model");
const project_model_1 = require("../project/project.model");
const mongoose_1 = require("mongoose");
const addTeamMember = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findById(payload.projectId);
    if (!project)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    let user = yield user_model_1.User.findOne({ email: payload.email });
    if (payload.mode === 'existing') {
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found (existing mode)');
        }
    }
    if (payload.mode === 'new') {
        if (!user) {
            user = yield user_model_1.User.create({
                name: payload.name,
                email: payload.email,
                password: payload.password,
                role: 'member',
            });
        }
    }
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid payload');
    }
    const alreadyExists = yield team_model_1.Team.findOne({
        projectId: payload.projectId,
        userId: user._id,
    });
    if (alreadyExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User already added to this project');
    }
    const teamMember = yield team_model_1.Team.create({
        projectId: new mongoose_1.Types.ObjectId(payload.projectId),
        userId: user._id,
        role: payload.role,
        department: payload.department,
        skills: payload.skills,
    });
    const populated = yield team_model_1.Team.findById(teamMember._id).populate('userId', 'name email role');
    return populated;
});
const getProjectTeam = (projectId_1, ...args_1) => __awaiter(void 0, [projectId_1, ...args_1], void 0, function* (projectId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        team_model_1.Team.find({ projectId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        team_model_1.Team.countDocuments({ projectId }),
    ]);
    const totalPage = Math.ceil(total / limit);
    return {
        data,
        meta: { page, limit, total, totalPage },
    };
});
const updateTeamMember = (teamId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedPayload = {};
    if (payload.role)
        allowedPayload.role = payload.role;
    if (payload.department !== undefined)
        allowedPayload.department = payload.department;
    if (payload.skills !== undefined)
        allowedPayload.skills = payload.skills;
    const updated = yield team_model_1.Team.findByIdAndUpdate(teamId, allowedPayload, { new: true })
        .populate('userId', 'name email');
    if (!updated)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Team member not found');
    return updated;
});
const removeTeamMember = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield team_model_1.Team.findByIdAndDelete(teamId);
    if (!deleted)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Team member not found');
    return null;
});
exports.TeamService = {
    addTeamMember,
    getProjectTeam,
    updateTeamMember,
    removeTeamMember,
};
