import { Schema, model } from 'mongoose';
import { TProject } from './project.interface';

const projectSchema = new Schema<TProject>(
  {
    title: { type: String, required: true },
    client: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    budget: Number,
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'archived'],
      default: 'planned',
    },
    taskStats: {
  total: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
},
    thumbnail: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Project = model<TProject>(
  'Project',
  projectSchema,
);
