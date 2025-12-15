"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = void 0;
const zod_1 = require("zod");
const task_constant_1 = require("./task.constant");
const objectId = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');
const createTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().optional(),
        sprintId: objectId, // required; projectId will be derived
        assignees: zod_1.z.array(objectId).optional(),
        estimateHours: zod_1.z.number().min(0).optional(),
        priority: zod_1.z.enum(Object.keys(task_constant_1.TASK_PRIORITY)).optional(),
        status: zod_1.z.enum(Object.keys(task_constant_1.TASK_STATUS)).optional(),
        dueDate: zod_1.z.string().optional(),
        attachments: zod_1.z.array(zod_1.z.string()).optional(),
        subtasks: zod_1.z
            .array(zod_1.z.object({
            title: zod_1.z.string().min(1),
            isDone: zod_1.z.boolean().optional(),
        }))
            .optional(),
    }),
});
const updateTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        assignees: zod_1.z.array(objectId).optional(),
        estimateHours: zod_1.z.number().min(0).optional(),
        priority: zod_1.z.enum(Object.keys(task_constant_1.TASK_PRIORITY)).optional(),
        status: zod_1.z.enum(Object.keys(task_constant_1.TASK_STATUS)).optional(),
        dueDate: zod_1.z.string().optional(),
        attachments: zod_1.z.array(zod_1.z.string()).optional(),
        subtasks: zod_1.z
            .array(zod_1.z.object({
            title: zod_1.z.string().min(1),
            isDone: zod_1.z.boolean().optional(),
        }))
            .optional(),
    }),
});
const updateTaskStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.keys(task_constant_1.TASK_STATUS)),
    }),
});
const logTaskTimeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        hours: zod_1.z.number().positive('Hours must be greater than 0'),
    }),
});
exports.taskValidation = {
    createTaskValidationSchema,
    updateTaskValidationSchema,
    updateTaskStatusValidationSchema,
    logTaskTimeValidationSchema
};
