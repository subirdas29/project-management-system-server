"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskCommentValidation = void 0;
const zod_1 = require("zod");
const createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        taskId: zod_1.z.string({ required_error: 'Task ID is required' }),
        content: zod_1.z.string().min(1, 'Comment content is required'),
        parentComment: zod_1.z.string().optional(),
    }),
});
exports.taskCommentValidation = {
    createCommentSchema,
};
