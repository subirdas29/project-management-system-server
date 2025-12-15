import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { Project } from '../project/project.model';
import { TTeamMember } from './team.interface';
import { Types } from 'mongoose';

type AddPayload =
  | {
      mode: 'existing';
      projectId: string;
      email: string;
      role: 'admin' | 'manager' | 'member';
      department?: string;
      skills?: string[];
    }
  | {
      mode: 'new';
      projectId: string;
      name: string;
      email: string;
      password: string;
      role: 'admin' | 'manager' | 'member';
      department?: string;
      skills?: string[];
    };

const addTeamMember = async (payload: AddPayload) => {
  const project = await Project.findById(payload.projectId);
  if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');

  let user = await User.findOne({ email: payload.email });


  if (payload.mode === 'existing') {
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found (existing mode)');
    }
  }


  if (payload.mode === 'new') {
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'member',
      });
    }
  }

  if (!user) {
 
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payload');
  }

  const alreadyExists = await Team.findOne({
    projectId: payload.projectId,
    userId: user._id,
  });

  if (alreadyExists) {
    throw new AppError(httpStatus.CONFLICT, 'User already added to this project');
  }

  const teamMember = await Team.create({
    projectId: new Types.ObjectId(payload.projectId),
    userId: user._id,
    role: payload.role, 
    department: payload.department,
    skills: payload.skills,
  });


 const populated = await Team.findById(teamMember._id).populate(
  'userId',
  'name email role',
);
return populated;

};

const getProjectTeam = async (projectId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Team.find({ projectId})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Team.countDocuments({ projectId }),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: { page, limit, total, totalPage },
  };
};

const updateTeamMember = async (teamId: string, payload: Partial<TTeamMember>) => {
  const allowedPayload: Partial<TTeamMember> = {};
  if (payload.role) allowedPayload.role = payload.role;
  if (payload.department !== undefined) allowedPayload.department = payload.department;
  if (payload.skills !== undefined) allowedPayload.skills = payload.skills;

  const updated = await Team.findByIdAndUpdate(teamId, allowedPayload, { new: true })
    .populate('userId', 'name email');

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return updated;
};

const removeTeamMember = async (teamId: string) => {
  const deleted = await Team.findByIdAndDelete(teamId);
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return null;
};




export const TeamService = {
  addTeamMember,
  getProjectTeam,
  updateTeamMember,
  removeTeamMember,
 
};
