"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.SprintService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const sprint_model_1 = require("./sprint.model");
const project_model_1 = require("../project/project.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const task_model_1 = require("../task/task.model");
const createSprint = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const projectObjectId = new mongoose_1.Types.ObjectId(payload.projectId);
    // ensure project exists (and not deleted)
    const project = yield project_model_1.Project.findOne({ _id: projectObjectId, });
    if (!project)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const lastSprint = yield sprint_model_1.Sprint.findOne({
            projectId: projectObjectId,
        })
            .sort({ sprintNumber: -1 })
            .session(session);
        const nextSprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;
        const nextOrder = nextSprintNumber;
        const sprintDoc = yield sprint_model_1.Sprint.create([
            {
                title: payload.title,
                projectId: projectObjectId,
                sprintNumber: nextSprintNumber,
                order: nextOrder,
                startDate: new Date(payload.startDate),
                endDate: new Date(payload.endDate),
            },
        ], { session });
        yield session.commitTransaction();
        yield session.endSession();
        return sprintDoc[0];
    }
    catch (_a) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create sprint');
    }
});
const getProjectSprints = (projectId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const projectObjectId = new mongoose_1.Types.ObjectId(projectId);
    const qb = new QueryBuilder_1.default(sprint_model_1.Sprint.find({ projectId: projectObjectId, }).sort({ order: 1 }), query)
        .search(['title'])
        .filter()
        .sort()
        .paginate()
        .fields();
    return {
        result: yield qb.modelQuery,
        meta: yield qb.countTotal(),
    };
});
const getSingleSprint = (sprintId) => __awaiter(void 0, void 0, void 0, function* () {
    const sprint = yield sprint_model_1.Sprint.findOne({ _id: sprintId, });
    if (!sprint)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sprint not found');
    return sprint;
});
const updateSprint = (sprintId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const safePayload = {
        title: payload.title,
        startDate: payload.startDate,
        endDate: payload.endDate,
    };
    const updated = yield sprint_model_1.Sprint.findOneAndUpdate({ _id: sprintId, }, safePayload, { new: true });
    if (!updated) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sprint not found');
    }
    return updated;
});
const deleteSprint = (sprintId) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield sprint_model_1.Sprint.findByIdAndDelete(sprintId);
    if (!deleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sprint not found');
    }
    return null;
});
const reorderSprints = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const projectObjectId = new mongoose_1.Types.ObjectId(payload.projectId);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const sprintIds = payload.items.map((i) => new mongoose_1.Types.ObjectId(i.sprintId));
        const count = yield sprint_model_1.Sprint.countDocuments({
            _id: { $in: sprintIds },
            projectId: projectObjectId,
        }).session(session);
        if (count !== payload.items.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid sprint list');
        }
        const tempOps = payload.items.map((i, index) => ({
            updateOne: {
                filter: { _id: new mongoose_1.Types.ObjectId(i.sprintId), projectId: projectObjectId },
                update: { $set: { order: -(index + 1) } },
            },
        }));
        yield sprint_model_1.Sprint.bulkWrite(tempOps, { session });
        const finalOps = payload.items.map((i) => ({
            updateOne: {
                filter: { _id: new mongoose_1.Types.ObjectId(i.sprintId), projectId: projectObjectId },
                update: { $set: { order: i.order } },
            },
        }));
        yield sprint_model_1.Sprint.bulkWrite(finalOps, { session });
        yield session.commitTransaction();
        return null;
    }
    catch (_a) {
        yield session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to reorder sprints');
    }
    finally {
        session.endSession();
    }
});
const getSprintDetails = (sprintId) => __awaiter(void 0, void 0, void 0, function* () {
    const sprint = yield sprint_model_1.Sprint.findById(sprintId);
    if (!sprint) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sprint not found');
    }
    const totalTasks = yield task_model_1.Task.countDocuments({
        sprintId,
        isDeleted: false,
    });
    const completedTasks = yield task_model_1.Task.countDocuments({
        sprintId,
        status: 'done',
        isDeleted: false,
    });
    const progress = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);
    return Object.assign(Object.assign({}, sprint.toObject()), { totalTasks,
        completedTasks,
        progress });
});
exports.SprintService = {
    createSprint,
    getProjectSprints,
    getSingleSprint,
    updateSprint,
    deleteSprint,
    reorderSprints,
    getSprintDetails
};
