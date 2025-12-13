import { Types } from 'mongoose';

export type TSprint = {
  title: string;
  sprintNumber: number;   
  order: number;          
  projectId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isDeleted?: boolean;
};
