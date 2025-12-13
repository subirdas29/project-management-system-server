import { z } from 'zod';
import { TASK_PRIORITY, TASK_STATUS } from './task.constant';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const createTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),

    sprintId: objectId, // required; projectId will be derived

    assignees: z.array(objectId).optional(),

    estimateHours: z.number().min(0).optional(),

    priority: z.enum(
      Object.keys(TASK_PRIORITY) as [string, ...string[]],
    ).optional(),

    status: z.enum(
      Object.keys(TASK_STATUS) as [string, ...string[]],
    ).optional(),

    dueDate: z.string().optional(),
    attachments: z.array(z.string()).optional(),

    subtasks: z
      .array(
        z.object({
          title: z.string().min(1),
          isDone: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),

    assignees: z.array(objectId).optional(),
    estimateHours: z.number().min(0).optional(),

    priority: z.enum(
      Object.keys(TASK_PRIORITY) as [string, ...string[]],
    ).optional(),

    status: z.enum(
      Object.keys(TASK_STATUS) as [string, ...string[]],
    ).optional(),

    dueDate: z.string().optional(),
    attachments: z.array(z.string()).optional(),

    subtasks: z
      .array(
        z.object({
          title: z.string().min(1),
          isDone: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

// Kanban drag-drop: only status update
const updateTaskStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      Object.keys(TASK_STATUS) as [string, ...string[]],
    ),
  }),
});

export const taskValidation = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  updateTaskStatusValidationSchema,
};
