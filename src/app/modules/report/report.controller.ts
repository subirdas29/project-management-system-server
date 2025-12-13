import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';

const getProjectReport = catchAsync(async (req, res) => {
  const result = await ReportService.getProjectReport(req.params.projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project report generated',
    data: result,
  });
});

const getUserReport = catchAsync(async (req, res) => {
  const result = await ReportService.getUserReport(req.params.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User report generated',
    data: result,
  });
});

export const ReportController = {
  getProjectReport,
  getUserReport,
};
