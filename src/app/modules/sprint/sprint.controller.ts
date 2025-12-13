
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SprintService } from './sprint.service';
import httpStatus from 'http-status';

const createSprint = catchAsync(async (req, res) => {
  const result = await SprintService.createSprint(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sprint created successfully',
    data: result,
  });
});

const getProjectSprints = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await SprintService.getProjectSprints(projectId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sprints fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  const result = await SprintService.getSingleSprint(sprintId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sprint fetched successfully',
    data: result,
  });
});

const updateSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  const result = await SprintService.updateSprint(sprintId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sprint updated successfully',
    data: result,
  });
});

const deleteSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  await SprintService.deleteSprint(sprintId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sprint deleted successfully',
    data: null,
  });
});

const reorderSprints = catchAsync(async (req, res) => {
  await SprintService.reorderSprints(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sprints reordered successfully',
    data: null,
  });
});

export const SprintController = {
  createSprint,
  getProjectSprints,
  getSingleSprint,
  updateSprint,
  deleteSprint,
  reorderSprints,
};
