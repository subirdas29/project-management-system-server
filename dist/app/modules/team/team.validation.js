"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamValidation = void 0;
const zod_1 = require("zod");
const base = zod_1.z.object({
    projectId: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['admin', 'manager', 'member']),
    department: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
});
const addExistingMemberSchema = zod_1.z.object({
    body: base.extend({
        mode: zod_1.z.literal('existing'),
    }),
});
const addNewMemberSchema = zod_1.z.object({
    body: base.extend({
        mode: zod_1.z.literal('new'),
        name: zod_1.z.string().min(1),
        password: zod_1.z.string().min(1),
    }),
});
exports.teamValidation = {
    addTeamMemberSchema: zod_1.z.union([addExistingMemberSchema, addNewMemberSchema]),
};
