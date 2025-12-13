import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { Project } from '../project/project.model';
import { TTeamMember } from './team.interface';
import { Types } from 'mongoose';

const addTeamMember = async (payload: {
  projectId: string;
  userId: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
  skills?: string[];
}) => {
  const project = await Project.findById(payload.projectId);
  if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');

  const user = await User.findById(payload.userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const teamMember = await Team.create({
    projectId: new Types.ObjectId(payload.projectId),
    userId: new Types.ObjectId(payload.userId),
    role: payload.role,
    department: payload.department,
    skills: payload.skills,
  });

  return teamMember;
};

const getProjectTeam = async (projectId: string) => {
  return await Team.find({ projectId })
    .populate('userId', 'name email')
    .sort({ createdAt: 1 });
};

const updateTeamMember = async (
  teamId: string,
  payload: Partial<TTeamMember>,
) => {
  const updated = await Team.findByIdAndUpdate(teamId, payload, { new: true });
  if (!updated)
    throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return updated;
};

const removeTeamMember = async (teamId: string) => {
  const deleted = await Team.findByIdAndDelete(teamId);
  if (!deleted)
    throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return null;
};

export const TeamService = {
  addTeamMember,
  getProjectTeam,
  updateTeamMember,
  removeTeamMember,
};
