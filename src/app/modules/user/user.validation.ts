import { z } from 'zod';
import { USER_ROLES } from './user.constant';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(Object.keys(USER_ROLES) as [string, ...string[]]).optional(), // default member
    department: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    department: z.string().optional(),
    skills: z.array(z.string()).optional(),
    profileImage: z.array(z.string()).optional(),
  }),
});

export const userValidation = {
  registerValidationSchema,
  updateProfileSchema,
};
