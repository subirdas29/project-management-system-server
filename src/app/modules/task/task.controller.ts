import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskService.getAllTasks(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await TaskService.getSingleTask(taskId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task fetched successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await TaskService.updateTask(taskId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

// Kanban drag-drop
const updateTaskStatus = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const result = await TaskService.updateTaskStatus(taskId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task status updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  await TaskService.deleteTask(taskId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully',
    data: null,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
