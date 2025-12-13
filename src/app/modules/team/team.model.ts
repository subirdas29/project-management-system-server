import { Schema, model } from 'mongoose';
import { TTeamMember } from './team.interface';

const teamSchema = new Schema<TTeamMember>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'member'],
      required: true,
    },
    department: { type: String },
    skills: { type: [String] },
  },
  { timestamps: true },
);

// same user cannot be added twice in same project
teamSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const Team = model<TTeamMember>('Team', teamSchema);
