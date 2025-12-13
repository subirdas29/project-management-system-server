import httpStatus from 'http-status';
import  { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Task } from './task.model';
import { TTask } from './task.interface';
import { taskSearchableFields } from './task.constant';
import { Sprint } from '../sprint/sprint.model';

const createTask = async (payload: Partial<TTask>) => {
  if (!payload.sprintId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'sprintId is required');
  }

  // 1) ensure sprint exists
  const sprint = await Sprint.findById(payload.sprintId);
  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, 'Sprint not found');

  // 2) derive projectId from sprint
  const taskPayload: Partial<TTask> = {
    ...payload,
    projectId: sprint.projectId as unknown as Types.ObjectId,
    sprintId: new Types.ObjectId(payload.sprintId),
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
  };

  const created = await Task.create(taskPayload);
  return created;
};

const getAllTasks = async (query: Record<string, unknown>) => {
  // Default: only active tasks
  const qb = new QueryBuilder(Task.find({ isDeleted: false }), query)
    .search(taskSearchableFields)
    .filter()     // supports: projectId, sprintId, status, priority, etc.
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

const updateTask = async (taskId: string, payload: Partial<TTask>) => {
  // protect relations from random changes
  const safePayload: Partial<TTask> = {
    title: payload.title,
    description: payload.description,
    assignees: payload.assignees,
    estimateHours: payload.estimateHours,
    priority: payload.priority,
    status: payload.status,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    attachments: payload.attachments,
    subtasks: payload.subtasks,
  };

  const updated = await Task.findOneAndUpdate(
    { _id: taskId, isDeleted: false },
    safePayload,
    { new: true },
  );

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  return updated;
};

// Kanban drag-drop
const updateTaskStatus = async (taskId: string, status: string) => {
  const updated = await Task.findOneAndUpdate(
    { _id: taskId, isDeleted: false },
    { status },
    { new: true },
  );

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  return updated;
};

const deleteTask = async (taskId: string) => {
  // soft delete is safer for tasks
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
