import { Schema, model } from 'mongoose';
import { TSprint } from './sprint.interface';

const sprintSchema = new Schema<TSprint>(
  {
    title: { type: String, required: true, trim: true },
    sprintNumber: { type: Number, required: true },
    order: { type: Number, required: true },

    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);


sprintSchema.index({ projectId: 1, sprintNumber: 1 }, { unique: true });

sprintSchema.index({ projectId: 1, order: 1 }, { unique: true });

export const Sprint = model<TSprint>('Sprint', sprintSchema);
