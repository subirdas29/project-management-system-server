import { Types } from 'mongoose';
import { TASK_PRIORITY, TASK_STATUS } from './task.constant';

export type TTaskStatus = keyof typeof TASK_STATUS;
export type TTaskPriority = keyof typeof TASK_PRIORITY;

export type TSubTask = {
  title: string;
  isDone?: boolean;
};

export type TAttachment = {
  url: string;
  type: 'image' | 'pdf';
};


export type TTaskActivity = {
  action: string;
  userId: Types.ObjectId;
  createdAt: Date;
};

export type TTimeLog = {
  userId: Types.ObjectId;
  hours: number;
  date: Date;
};


export type TTask = {
  title: string;
  description?: string;

  estimateHours?: number;

  loggedHours?: number;
  timeLogs?: TTimeLog[]; 

  projectId: Types.ObjectId;
  sprintId: Types.ObjectId;

  assignees?: Types.ObjectId[];

  priority: TTaskPriority;
  status: TTaskStatus;

  dueDate?: Date;
  attachments?: TAttachment[];
  subtasks?: TSubTask[];

  isDeleted?: boolean;
  activityLog?: TTaskActivity[];
  createdAt?: Date;
  updatedAt?: Date;
};
