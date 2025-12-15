"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sprintValidation = void 0;
const zod_1 = require("zod");
const createSprintValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        projectId: zod_1.z.string().min(1, 'ProjectId is required'),
        startDate: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: 'Invalid startDate',
        }),
        endDate: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: 'Invalid endDate',
        }),
    }),
});
const updateSprintValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        startDate: zod_1.z
            .string()
            .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid startDate' })
            .optional(),
        endDate: zod_1.z
            .string()
            .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid endDate' })
            .optional(),
    }),
});
const reorderSprintValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectId: zod_1.z.string().min(1, 'ProjectId is required'),
        items: zod_1.z
            .array(zod_1.z.object({
            sprintId: zod_1.z.string().min(1),
            order: zod_1.z.number().int().min(1),
        }))
            .min(1, 'At least one reorder item is required'),
    }),
});
exports.sprintValidation = {
    createSprintValidationSchema,
    updateSprintValidationSchema,
    reorderSprintValidationSchema,
};
