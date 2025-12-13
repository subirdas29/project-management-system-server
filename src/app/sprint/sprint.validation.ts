import { z } from 'zod';

const createSprintValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    projectId: z.string().min(1, 'ProjectId is required'),

    startDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: 'Invalid startDate',
    }),

    endDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: 'Invalid endDate',
    }),
  }),
});

const updateSprintValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    startDate: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid startDate' })
      .optional(),
    endDate: z
      .string()
      .refine((v) => !isNaN(Date.parse(v)), { message: 'Invalid endDate' })
      .optional(),
  }),
});


const reorderSprintValidationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, 'ProjectId is required'),
    items: z
      .array(
        z.object({
          sprintId: z.string().min(1),
          order: z.number().int().min(1),
        }),
      )
      .min(1, 'At least one reorder item is required'),
  }),
});

export const sprintValidation = {
  createSprintValidationSchema,
  updateSprintValidationSchema,
  reorderSprintValidationSchema,
};
