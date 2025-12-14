import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReportService } from './report.service';

const getProjectReport = catchAsync(async (req, res) => {
  const { projectId } = req.params;

  const result =
    await ReportService.getProjectReport(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project report fetched successfully',
    data: result,
  });
});

const getMyReport = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result =
    await ReportService.getUserReport(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User report fetched successfully',
    data: result,
  });
});

const getUserReport = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result =
    await ReportService.getUserReport(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User report fetched successfully',
    data: result,
  });
});

export const ReportController = {
  getProjectReport,
  getUserReport,
  getMyReport,
};
