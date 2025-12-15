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
exports.ProjectService = void 0;
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sprint_model_1 = require("../sprint/sprint.model");
const task_model_1 = require("../task/task.model");
const project_model_1 = require("./project.model");
const http_status_1 = __importDefault(require("http-status"));
const team_model_1 = require("../team/team.model");
const createProject = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield project_model_1.Project.create(Object.assign(Object.assign({}, payload), { createdBy: userId }));
});
const getAllProjects = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    let projectQuery;
    if (user.role === 'member') {
        const teamMembers = yield team_model_1.Team.find({ userId: user.userId }, { projectId: 1, _id: 0 });
        const projectIds = teamMembers.map((tm) => tm.projectId);
        projectQuery = project_model_1.Project.find({
            _id: { $in: projectIds },
            isDeleted: false,
        });
    }
    else {
        projectQuery = project_model_1.Project.find({
            isDeleted: false,
        });
    }
    const qb = new QueryBuilder_1.default(projectQuery, query)
        .search(['title', 'client'])
        .filter()
        .sort()
        .paginate()
        .fields();
    return {
        result: yield qb.modelQuery,
        meta: yield qb.countTotal(),
    };
});
const getSingleProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOne({
        _id: id,
        isDeleted: false,
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    return project;
});
const updateProject = (projectId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOneAndUpdate({ _id: projectId, isDeleted: false }, payload, { new: true });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    return project;
});
const deleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOneAndUpdate({ _id: projectId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    return null;
});
const getProjectOverview = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const pid = new mongoose_1.Types.ObjectId(projectId);
    const project = yield project_model_1.Project.findOne({
        _id: pid,
        isDeleted: false,
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    const totalSprints = yield sprint_model_1.Sprint.countDocuments({
        projectId: pid,
        isDeleted: false,
    });
    const totalTasks = yield task_model_1.Task.countDocuments({
        projectId: pid,
        isDeleted: false,
    });
    const completedTasks = yield task_model_1.Task.countDocuments({
        projectId: pid,
        status: 'done',
        isDeleted: false,
    });
    const progress = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);
    return {
        project,
        sprintStats: {
            totalSprints,
            totalTasks,
            completedTasks,
        },
        progress,
    };
});
exports.ProjectService = {
    createProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    getProjectOverview
};
