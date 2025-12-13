export const TASK_STATUS = {
  todo: 'todo',
  inprogress: 'inprogress',
  review: 'review',
  done: 'done',
} as const;

export const TASK_PRIORITY = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  urgent: 'urgent',
} as const;

export const taskSearchableFields = ['title', 'description'];
