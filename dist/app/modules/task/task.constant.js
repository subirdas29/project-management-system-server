"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSearchableFields = exports.TASK_PRIORITY = exports.TASK_STATUS = void 0;
exports.TASK_STATUS = {
    todo: 'todo',
    inprogress: 'inprogress',
    review: 'review',
    done: 'done',
};
exports.TASK_PRIORITY = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    urgent: 'urgent',
};
exports.taskSearchableFields = ['title', 'description'];
