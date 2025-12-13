// import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Sprint } from '../sprint/sprint.model';
import { Task } from '../task/task.model';
import { TProject } from './project.interface';
import { Project } from './project.model';

import httpStatus from 'http-status';


const createProject = async (payload:TProject,
    // userId:Types.ObjectId
) => {
  return await Project.create({
    ...payload,
    // createdBy: userId,
  });
};

const getAllProjects = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(
    Project.find({ isDeleted: false }),
    query,
  )
    .search(['title', 'client'])
    .filter()
    .sort()
    .paginate()
    .fields();

  return {
    result: await qb.modelQuery,
    meta: await qb.countTotal(),
  };
};

const getSingleProject = async (id: string) => {
  const project = await Project.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project;
};

const updateProject = async (
  projectId: string,
  payload: Partial<TProject>,
) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    payload,
    { new: true },
  );

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project;
};

const deleteProject = async (projectId: string) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return null;
};

const getProjectOverview = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError(404, 'Project not found');

  const totalTasks = await Task.countDocuments({ projectId });
  const completedTasks = await Task.countDocuments({
    projectId,
    status: 'Done',
  });

  const sprints = await Sprint.find({ projectId }).select('title sprintNumber');

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    project,
    totalTasks,
    completedTasks,
    progress,
    sprints,
  };
};


export const ProjectService = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getProjectOverview
};
