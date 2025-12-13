import { Types } from 'mongoose';

export type TTaskComment = {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  parentComment?: Types.ObjectId;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
