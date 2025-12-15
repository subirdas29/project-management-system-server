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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const mongoose_1 = require("mongoose");
const task_model_1 = require("../task/task.model");
const getProjectReport = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const pid = new mongoose_1.Types.ObjectId(projectId);
    const result = yield task_model_1.Task.aggregate([
        {
            $match: {
                projectId: pid,
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: '$projectId',
                totalTasks: { $sum: 1 },
                completedTasks: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
                    },
                },
                totalEstimatedHours: {
                    $sum: { $ifNull: ['$estimateHours', 0] },
                },
                totalLoggedHours: {
                    $sum: { $ifNull: ['$loggedHours', 0] },
                },
            },
        },
    ]);
    const data = result[0] || {
        totalTasks: 0,
        completedTasks: 0,
        totalEstimatedHours: 0,
        totalLoggedHours: 0,
    };
    return {
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        remainingTasks: data.totalTasks - data.completedTasks,
        progressPercent: data.totalTasks === 0
            ? 0
            : Math.round((data.completedTasks / data.totalTasks) * 100),
        totalEstimatedHours: data.totalEstimatedHours,
        totalLoggedHours: data.totalLoggedHours,
    };
});
const getUserReport = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = new mongoose_1.Types.ObjectId(userId);
    const result = yield task_model_1.Task.aggregate([
        {
            $match: {
                assignees: uid,
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
                    },
                },
                totalEstimatedHours: {
                    $sum: { $ifNull: ['$estimateHours', 0] },
                },
                totalLoggedHours: {
                    $sum: { $ifNull: ['$loggedHours', 0] },
                },
            },
        },
    ]);
    const data = result[0] || {
        totalTasks: 0,
        completedTasks: 0,
        totalEstimatedHours: 0,
        totalLoggedHours: 0,
    };
    return {
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        remainingTasks: data.totalTasks - data.completedTasks,
        totalEstimatedHours: data.totalEstimatedHours,
        totalLoggedHours: data.totalLoggedHours,
    };
});
const getMyProjectReports = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = new mongoose_1.Types.ObjectId(userId);
    return task_model_1.Task.aggregate([
        {
            $match: {
                assignees: uid,
                isDeleted: false,
            },
        },
        {
            $unwind: {
                path: '$timeLogs',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                $or: [
                    { 'timeLogs.userId': uid },
                    { timeLogs: null },
                ],
            },
        },
        {
            $group: {
                _id: '$projectId',
                totalTasks: { $addToSet: '$_id' },
                completedTasks: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
                    },
                },
                totalEstimatedHours: {
                    $sum: { $ifNull: ['$estimateHours', 0] },
                },
                totalLoggedHours: {
                    $sum: { $ifNull: ['$timeLogs.hours', 0] },
                },
            },
        },
        {
            $addFields: {
                totalTasks: { $size: '$totalTasks' },
            },
        },
        {
            $lookup: {
                from: 'projects',
                localField: '_id',
                foreignField: '_id',
                as: 'project',
            },
        },
        { $unwind: '$project' },
        {
            $project: {
                projectId: '$_id',
                projectTitle: '$project.title',
                totalTasks: 1,
                completedTasks: 1,
                remainingTasks: {
                    $subtract: ['$totalTasks', '$completedTasks'],
                },
                progressPercent: {
                    $cond: [
                        { $eq: ['$totalTasks', 0] },
                        0,
                        {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: ['$completedTasks', '$totalTasks'] },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                    ],
                },
                totalEstimatedHours: 1,
                totalLoggedHours: 1,
            },
        },
    ]);
});
exports.ReportService = {
    getProjectReport,
    getUserReport,
    getMyProjectReports,
};
