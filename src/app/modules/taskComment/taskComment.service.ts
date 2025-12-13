import { Types } from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TaskComment } from './taskComment.model';
import { TTaskComment } from './taskComment.interface';
import { Task } from '../task/task.model';

const addComment = async (
  payload: {
    taskId: string;
    content: string;
    parentComment?: string;
  },
  userId: string,
) => {
  const task = await Task.findById(payload.taskId);
  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const commentData: TTaskComment = {
    taskId: new Types.ObjectId(payload.taskId),
    userId: new Types.ObjectId(userId),
    content: payload.content,
    parentComment: payload.parentComment
      ? new Types.ObjectId(payload.parentComment)
      : undefined,
  };

  return await TaskComment.create(commentData);
};

const getTaskComments = async (taskId: string) => {
  return await TaskComment.find({
    taskId: new Types.ObjectId(taskId),
    isDeleted: false,
  })
    .populate('userId', 'name email')
    .sort({ createdAt: 1 });
};

const deleteComment = async (commentId: string, userId: string) => {
  const comment = await TaskComment.findById(commentId);

  if (!comment || comment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }


  if (comment.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to delete comment');
  }

  comment.isDeleted = true;
  await comment.save();

  return null;
};

export const TaskCommentService = {
  addComment,
  getTaskComments,
  deleteComment,
};
