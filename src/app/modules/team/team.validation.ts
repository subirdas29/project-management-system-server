import { z } from 'zod';

const addTeamMemberSchema = z.object({
  body: z.object({
    projectId: z.string(),
    userId: z.string(),
    role: z.enum(['admin', 'manager', 'member']),
    department: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
});

export const teamValidation = {
  addTeamMemberSchema,
};
