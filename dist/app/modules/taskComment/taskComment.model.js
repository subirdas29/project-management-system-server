"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskComment = void 0;
const mongoose_1 = require("mongoose");
const taskCommentSchema = new mongoose_1.Schema({
    taskId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TaskComment',
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.TaskComment = (0, mongoose_1.model)('TaskComment', taskCommentSchema);
