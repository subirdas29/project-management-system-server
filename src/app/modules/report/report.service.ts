import { Task } from '../task/task.model';
import { Types } from 'mongoose';

const getProjectReport = async (projectId: string) => {
  const pid = new Types.ObjectId(projectId);

  const totalTasks = await Task.countDocuments({ projectId: pid });
  const completedTasks = await Task.countDocuments({
    projectId: pid,
    status: 'done',
  });

  const tasks = await Task.find({ projectId: pid }).select('estimateHours');
  const totalEstimatedHours = tasks.reduce((sum, task) => {
  return sum + Number(task.estimateHours ?? 0);
}, 0);


  return {
    totalTasks,
    completedTasks,
    remainingTasks: totalTasks - completedTasks,
    progressPercent:
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    totalEstimatedHours,
  };
};

const getUserReport = async (userId: string) => {
  const uid = new Types.ObjectId(userId);

  const tasks = await Task.find({ assignees: uid });
  const completed = tasks.filter((t) => t.status === 'done').length;

  return {
    totalTasks: tasks.length,
    completedTasks: completed,
    remainingTasks: tasks.length - completed,
    totalEstimatedHours: tasks.reduce(
      (sum, t) => sum + (t.estimateHours || 0),
      0,
    ),
  };
};

export const ReportService = {
  getProjectReport,
  getUserReport,
};
