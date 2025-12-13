import { Types } from 'mongoose';
import { TASK_PRIORITY, TASK_STATUS } from './task.constant';

export type TTaskStatus = keyof typeof TASK_STATUS;
export type TTaskPriority = keyof typeof TASK_PRIORITY;

export type TSubTask = {
  title: string;
  isDone?: boolean;
};

export type TTask = {
  title: string;
  description?: string;

  // relations
  projectId: Types.ObjectId;  
  sprintId: Types.ObjectId;

  assignees?: Types.ObjectId[]; 

  estimateHours?: number;
  priority: TTaskPriority;
  status: TTaskStatus;
  dueDate?: Date;

  attachments?: string[];
  subtasks?: TSubTask[];

  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};


