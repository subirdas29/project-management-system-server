import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';

export const getProjectReport = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const data = await ReportService.getProjectReport(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project report fetched',
    data,
  });
});

export const getMyReport = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await ReportService.getUserReport(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User report fetched',
    data,
  });
});

export const ReportController = {
  getProjectReport,
  getMyReport,
};
