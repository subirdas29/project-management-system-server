"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const task_constant_1 = require("./task.constant");
const subTaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
}, { _id: false });
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    sprintId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sprint', required: true },
    assignees: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    estimateHours: { type: Number, min: 0 },
    priority: {
        type: String,
        required: true,
        enum: Object.keys(task_constant_1.TASK_PRIORITY),
        default: 'medium',
    },
    status: {
        type: String,
        required: true,
        enum: Object.keys(task_constant_1.TASK_STATUS),
        default: 'todo',
    },
    timeLogs: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            hours: {
                type: Number,
                required: true,
                min: 0,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    loggedHours: {
        type: Number,
        min: 0,
        default: 0,
    },
    activityLog: [
        {
            action: { type: String, required: true },
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    dueDate: { type: Date },
    attachments: { type: [String], default: [] },
    subtasks: { type: [subTaskSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// indexes for fast filters
taskSchema.index({ projectId: 1, sprintId: 1 });
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ projectId: 1, priority: 1 });
taskSchema.index({ assignees: 1 });
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
