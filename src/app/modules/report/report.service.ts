import { Types } from 'mongoose';
import { Task } from '../task/task.model';


const getProjectReport = async (projectId: string) => {
  const pid = new Types.ObjectId(projectId);

  const result = await Task.aggregate([
    {
      $match: {
        projectId: pid,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$projectId',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
          },
        },
        totalEstimatedHours: {
          $sum: { $ifNull: ['$estimateHours', 0] },
        },
        totalLoggedHours: {
          $sum: { $ifNull: ['$loggedHours', 0] },
        },
      },
    },
  ]);

  const data = result[0] || {
    totalTasks: 0,
    completedTasks: 0,
    totalEstimatedHours: 0,
    totalLoggedHours: 0,
  };

  return {
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    remainingTasks: data.totalTasks - data.completedTasks,
    progressPercent:
      data.totalTasks === 0
        ? 0
        : Math.round(
            (data.completedTasks / data.totalTasks) * 100,
          ),
    totalEstimatedHours: data.totalEstimatedHours,
    totalLoggedHours: data.totalLoggedHours,
  };
};


const getUserReport = async (userId: string) => {
  const uid = new Types.ObjectId(userId);

  const result = await Task.aggregate([
    {
      $match: {
        assignees: uid,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
          },
        },
        totalEstimatedHours: {
          $sum: { $ifNull: ['$estimateHours', 0] },
        },
        totalLoggedHours: {
          $sum: { $ifNull: ['$loggedHours', 0] },
        },
      },
    },
  ]);

  const data = result[0] || {
    totalTasks: 0,
    completedTasks: 0,
    totalEstimatedHours: 0,
    totalLoggedHours: 0,
  };

  return {
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    remainingTasks: data.totalTasks - data.completedTasks,
    totalEstimatedHours: data.totalEstimatedHours,
    totalLoggedHours: data.totalLoggedHours,
  };
};

export const ReportService = {
  getProjectReport,
  getUserReport,
};
