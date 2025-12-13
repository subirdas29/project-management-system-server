import { Types } from 'mongoose';

export type TProjectStatus =
  | 'planned'
  | 'active'
  | 'completed'
  | 'archived';

export type TProject = {
  title: string;
  client: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  budget?: number;
  status: TProjectStatus;
  thumbnail?: string;
  createdBy: Types.ObjectId;
  isDeleted?: boolean;
   taskStats: {
  total: number;
  completed: number;
},
};


