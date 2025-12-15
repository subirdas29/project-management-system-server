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
exports.TaskCommentService = void 0;
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const taskComment_model_1 = require("./taskComment.model");
const task_model_1 = require("../task/task.model");
const addComment = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(payload.taskId);
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task not found');
    }
    const commentData = {
        taskId: new mongoose_1.Types.ObjectId(payload.taskId),
        userId: new mongoose_1.Types.ObjectId(userId),
        content: payload.content,
        parentComment: payload.parentComment
            ? new mongoose_1.Types.ObjectId(payload.parentComment)
            : undefined,
    };
    return yield taskComment_model_1.TaskComment.create(commentData);
});
const getTaskComments = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskComment_model_1.TaskComment.find({
        taskId: new mongoose_1.Types.ObjectId(taskId),
        isDeleted: false,
    })
        .populate('userId', 'name email role')
        .sort({ createdAt: 1 });
});
const updateComment = (commentId, content, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield taskComment_model_1.TaskComment.findById(commentId);
    if (!comment || comment.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized');
    }
    comment.content = content;
    yield comment.save();
    return comment;
});
const deleteComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield taskComment_model_1.TaskComment.findById(commentId);
    if (!comment || comment.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to delete comment');
    }
    comment.isDeleted = true;
    yield comment.save();
    return null;
});
exports.TaskCommentService = {
    addComment,
    getTaskComments,
    updateComment,
    deleteComment,
};
