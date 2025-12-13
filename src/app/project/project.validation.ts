import { z } from 'zod';

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    client: z.string().min(1, 'Client is required'),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    budget: z.number().optional(),
    status: z.enum(['planned', 'active', 'completed', 'archived']).optional(),
    thumbnail: z.string().optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    client: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z.number().optional(),
    status: z.enum(['planned', 'active', 'completed', 'archived']).optional(),
    thumbnail: z.string().optional(),
  }),
});

export const projectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
