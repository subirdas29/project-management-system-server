import { z } from 'zod';

const base = z.object({
  projectId: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member']),
  department: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

const addExistingMemberSchema = z.object({
  body: base.extend({
    mode: z.literal('existing'),
   
  }),
});

const addNewMemberSchema = z.object({
  body: base.extend({
    mode: z.literal('new'),
    name: z.string().min(1),
    password: z.string().min(1),
  }),
});

export const teamValidation = {
  addTeamMemberSchema: z.union([addExistingMemberSchema, addNewMemberSchema]),
};
