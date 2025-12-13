import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { TeamService } from './team.service';

const addTeamMember = catchAsync(async (req, res) => {
  const result = await TeamService.addTeamMember(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Team member added',
    data: result,
  });
});

const getProjectTeam = catchAsync(async (req, res) => {
  const result = await TeamService.getProjectTeam(req.params.projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project team fetched',
    data: result,
  });
});

const updateTeamMember = catchAsync(async (req, res) => {
  const result = await TeamService.updateTeamMember(
    req.params.teamId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team member updated',
    data: result,
  });
});

const removeTeamMember = catchAsync(async (req, res) => {
  await TeamService.removeTeamMember(req.params.teamId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team member removed',
    data: null,
  });
});

export const TeamController = {
  addTeamMember,
  getProjectTeam,
  updateTeamMember,
  removeTeamMember,
};
