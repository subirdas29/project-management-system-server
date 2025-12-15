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
exports.TaskService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const task_model_1 = require("./task.model");
const task_constant_1 = require("./task.constant");
const sprint_model_1 = require("../sprint/sprint.model");
const createTask = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.sprintId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'sprintId is required');
    }
    const sprint = yield sprint_model_1.Sprint.findById(payload.sprintId);
    if (!sprint)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sprint not found');
    const taskPayload = Object.assign(Object.assign({}, payload), { projectId: sprint.projectId, sprintId: new mongoose_1.Types.ObjectId(payload.sprintId), dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined });
    const created = yield task_model_1.Task.create(Object.assign(Object.assign({}, taskPayload), { activityLog: [
            {
                action: 'Task created',
                userId: new mongoose_1.Types.ObjectId(user.userId),
                createdAt: new Date(),
            },
        ] }));
    return created;
});
const getAllTasks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(task_model_1.Task.find({ isDeleted: false }), query)
        .search(task_constant_1.taskSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield qb.modelQuery.populate([
        { path: 'assignees', select: 'name email role' },
        { path: 'sprintId', select: 'title sprintNumber order projectId' },
        { path: 'projectId', select: 'title client status' },
    ]);
    const meta = yield qb.countTotal();
    return { result, meta };
});
const getSingleTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findOne({
        _id: taskId,
        isDeleted: false,
    }).populate([
        { path: 'assignees', select: 'name email role' },
        { path: 'sprintId', select: 'title sprintNumber order projectId' },
        { path: 'projectId', select: 'title client status' },
        {
            path: 'activityLog.userId',
            select: 'name email role',
        },
    ]);
    if (!task)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    return task;
});
const logTaskTime = (taskId, hours, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (hours <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Hours must be positive');
    }
    const task = yield task_model_1.Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    }
    if (user.role === 'member' &&
        task.assignees &&
        !task.assignees.map(id => id.toString()).includes(user.userId)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not assigned to this task');
    }
    task.timeLogs = task.timeLogs || [];
    task.timeLogs.push({
        userId: new mongoose_1.Types.ObjectId(user.userId),
        hours,
        date: new Date(),
    });
    task.loggedHours = task.timeLogs.reduce((sum, log) => sum + log.hours, 0);
    (_a = task.activityLog) === null || _a === void 0 ? void 0 : _a.push({
        action: `Logged ${hours} hours`,
        userId: new mongoose_1.Types.ObjectId(user.userId),
        createdAt: new Date(),
    });
    yield task.save();
    const populatedTask = yield task_model_1.Task.findById(task._id).populate([
        { path: 'assignees', select: 'name email role' },
        { path: 'projectId', select: 'title client status' },
        { path: 'sprintId', select: 'title sprintNumber order projectId' },
        { path: 'activityLog.userId', select: 'name email role' },
        { path: 'timeLogs.userId', select: 'name email role' },
    ]);
    return populatedTask;
});
const updateTask = (taskId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const task = yield task_model_1.Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    }
    task.title = (_a = payload.title) !== null && _a !== void 0 ? _a : task.title;
    task.description = (_b = payload.description) !== null && _b !== void 0 ? _b : task.description;
    task.assignees = (_c = payload.assignees) !== null && _c !== void 0 ? _c : task.assignees;
    task.estimateHours = (_d = payload.estimateHours) !== null && _d !== void 0 ? _d : task.estimateHours;
    task.priority = (_e = payload.priority) !== null && _e !== void 0 ? _e : task.priority;
    task.status = (_f = payload.status) !== null && _f !== void 0 ? _f : task.status;
    task.dueDate = payload.dueDate
        ? new Date(payload.dueDate)
        : task.dueDate;
    task.attachments = (_g = payload.attachments) !== null && _g !== void 0 ? _g : task.attachments;
    task.subtasks = (_h = payload.subtasks) !== null && _h !== void 0 ? _h : task.subtasks;
    (_j = task.activityLog) === null || _j === void 0 ? void 0 : _j.push({
        action: 'Task details updated',
        userId: new mongoose_1.Types.ObjectId(user.userId),
        createdAt: new Date(),
    });
    yield task.save();
    return task;
});
const updateTaskStatus = (taskId, status, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const task = yield task_model_1.Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    }
    if (user.role === 'member' &&
        task.assignees &&
        !task.assignees.map(id => id.toString()).includes(user.userId)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not assigned to this task');
    }
    if (task.status === 'review' &&
        status === 'done' &&
        !['admin', 'manager'].includes(user.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Manager approval required to complete task');
    }
    task.status = status;
    (_a = task.activityLog) === null || _a === void 0 ? void 0 : _a.push({
        action: `Status changed to ${status}`,
        userId: new mongoose_1.Types.ObjectId(user.userId),
        createdAt: new Date(),
    });
    if (task.status === 'review' && status === 'done') {
        (_b = task.activityLog) === null || _b === void 0 ? void 0 : _b.push({
            action: 'Task approved by manager',
            userId: new mongoose_1.Types.ObjectId(user.userId),
            createdAt: new Date(),
        });
    }
    yield task.save();
    return task;
});
const deleteTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield task_model_1.Task.findOneAndUpdate({ _id: taskId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!deleted)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    return null;
});
exports.TaskService = {
    createTask,
    getAllTasks,
    getSingleTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    logTaskTime,
};
