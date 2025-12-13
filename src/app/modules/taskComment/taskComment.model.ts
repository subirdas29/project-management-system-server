import { Schema, model } from 'mongoose';
import { TTaskComment } from './taskComment.interface';

const taskCommentSchema = new Schema<TTaskComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'TaskComment',
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const TaskComment = model<TTaskComment>(
  'TaskComment',
  taskCommentSchema,
);
