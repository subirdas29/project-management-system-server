import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { TaskCommentService } from './taskComment.service';

const addComment = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await TaskCommentService.addComment(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const getTaskComments = catchAsync(async (req, res) => {
  const { taskId } = req.params;

  const result = await TaskCommentService.getTaskComments(taskId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const result = await TaskCommentService.updateComment(
    req.params.commentId,
    req.body.content,
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated',
    data: result,
  });
});


const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user;

  const result = await TaskCommentService.deleteComment(commentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const TaskCommentController = {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
};
