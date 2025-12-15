
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectService } from './project.service';
import httpStatus from 'http-status';

const createProject = catchAsync(async (req, res) => {
  const result = await ProjectService.createProject(
    req.body,
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
 const result = await ProjectService.getAllProjects(
  req.query,
  {
    userId: req.user.userId,
    role: req.user.role,
  }
);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectService.getSingleProject(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project fetched successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectService.updateProject(
    projectId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  await ProjectService.deleteProject(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
    data: null,
  });
});
const getProjectOverview = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectService.getProjectOverview(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project overview fetched',
    data: result,
  });
});


export const ProjectController = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getProjectOverview
};

