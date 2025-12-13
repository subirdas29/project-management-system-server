import { Types } from 'mongoose';

export type TTeamRole = 'admin' | 'manager' | 'member';

export type TTeamMember = {
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: TTeamRole;
  department?: string;
  skills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
