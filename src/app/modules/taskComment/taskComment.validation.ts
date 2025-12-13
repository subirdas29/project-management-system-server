import { z } from 'zod';

const createCommentSchema = z.object({
  body: z.object({
    taskId: z.string({ required_error: 'Task ID is required' }),
    content: z.string().min(1, 'Comment content is required'),
    parentComment: z.string().optional(),
  }),
});

export const taskCommentValidation = {
  createCommentSchema,
};
