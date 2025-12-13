import httpStatus from 'http-status';
import  { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Task } from './task.model';
import { TTask, TTaskStatus } from './task.interface';
import { taskSearchableFields } from './task.constant';
import { Sprint } from '../sprint/sprint.model';

const createTask = async (payload: Partial<TTask> , user: { userId: string; role: string }) => {
  if (!payload.sprintId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'sprintId is required');
  }


  const sprint = await Sprint.findById(payload.sprintId);
  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, 'Sprint not found');


  const taskPayload: Partial<TTask> = {
    ...payload,
    projectId: sprint.projectId as unknown as Types.ObjectId,
    sprintId: new Types.ObjectId(payload.sprintId),
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
  };

  const created = await Task.create({
  ...taskPayload,
  activityLog: [
    {
      action: 'Task created',
      userId: new Types.ObjectId(user.userId),
      createdAt: new Date(),
    },
  ],
});

  return created;
};

const getAllTasks = async (query: Record<string, unknown>) => {

  const qb = new QueryBuilder(Task.find({ isDeleted: false }), query)
    .search(taskSearchableFields)
    .filter()  
    .sort()
    .paginate()
    .fields();

  const result = await qb.modelQuery.populate([
    { path: 'assignees', select: 'name email role' },
    { path: 'sprintId', select: 'title sprintNumber order projectId' },
    { path: 'projectId', select: 'title client status' },
  ]);

  const meta = await qb.countTotal();

  return { result, meta };
};

const getSingleTask = async (taskId: string) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false }).populate([
    { path: 'assignees', select: 'name email role' },
    { path: 'sprintId', select: 'title sprintNumber order projectId' },
    { path: 'projectId', select: 'title client status' },
  ]);

  if (!task) throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  return task;
};

const updateTask = async (
  taskId: string,
  payload: Partial<TTask>,
  user: { userId: string; role: string },
) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }


  task.title = payload.title ?? task.title;
  task.description = payload.description ?? task.description;
  task.assignees = payload.assignees ?? task.assignees;
  task.estimateHours = payload.estimateHours ?? task.estimateHours;
  task.priority = payload.priority ?? task.priority;
  task.status = payload.status ?? task.status;
  task.dueDate = payload.dueDate
    ? new Date(payload.dueDate)
    : task.dueDate;
  task.attachments = payload.attachments ?? task.attachments;
  task.subtasks = payload.subtasks ?? task.subtasks;

  task.activityLog?.push({
    action: 'Task details updated',
    userId: new Types.ObjectId(user.userId),
    createdAt: new Date(),
  });

  await task.save();
  return task;
};



const updateTaskStatus = async (
  taskId: string,
  status: TTaskStatus,
  user: { userId: string; role: string },
) => {
  const task = await Task.findOne({ _id: taskId, isDeleted: false });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }


  if (
    user.role === 'member' &&
    task.assignees &&
    !task.assignees.map(id => id.toString()).includes(user.userId)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not assigned to this task',
    );
  }


  if (
    task.status === 'review' &&
    status === 'done' &&
    !['admin', 'manager'].includes(user.role)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Manager approval required to complete task',
    );
  }

  task.status = status;


task.activityLog?.push({
  action: `Status changed to ${status}`,
  userId: new Types.ObjectId(user.userId),
  createdAt: new Date(),
});


if (task.status === 'review' && status === 'done') {
  task.activityLog?.push({
    action: 'Task approved by manager',
    userId: new Types.ObjectId(user.userId),
    createdAt: new Date(),
  });
}
  await task.save();

  return task;
};


const deleteTask = async (taskId: string) => {

  const deleted = await Task.findOneAndUpdate(
    { _id: taskId, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  return null;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
