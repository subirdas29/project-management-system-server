"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        role: zod_1.z.enum(Object.keys(user_constant_1.USER_ROLES)).optional(), // default member
        department: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        profileImage: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.userValidation = {
    registerValidationSchema,
    updateProfileSchema,
};
